---
id: JOEY-18.2
title: Move blog post review to a background job with Inertia polling
status: In Progress
assignee:
  - Pi
created_date: '2026-08-04 17:13'
updated_date: '2026-08-04 19:03'
labels:
  - feature
  - ai
  - blog
  - architecture
  - queue
milestone: blog-review-async
dependencies: []
references:
  - .backlog/tasks/joey-18 - Add-in-app-blog-post-review-agent.md
  - >-
    .backlog/tasks/joey-18.1 -
    Improve-blog-review-diagnostics-and-timeout-handling.md
documentation:
  - 'https://inertiajs.com/docs/v3/data-props/polling'
  - 'https://laravel.com/docs/13.x/queues'
  - 'https://laravel.com/docs/13.x/ai-sdk'
parent_task_id: JOEY-18
priority: high
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Motivation

The in-app blog post review (JOEY-18) currently runs as a **synchronous browser request**. The full Anthropic call (10–60s for long posts) happens inside the HTTP request lifecycle, which forces every upstream layer to accommodate that latency:

- The **HTTP/Anthropic timeout** is 120s.
- The **Devenv PHP `max_execution_time`** was raised to 180s just to not kill the request first (JOEY-18.1).
- A production **reverse proxy** (Caddy / Cloud / nginx) would need its own timeout raised above 120s, or it returns a 502 while PHP is still working.
- The browser holds an open `useHttp` connection for the entire duration.

This is fragile and operationally expensive. The robust fix is to **move the Anthropic call into a queued background job** and let the frontend poll for status. The synchronous request then becomes a fast dispatch; the slow provider work runs in a worker with no browser or proxy deadline.

## Current architecture (exactly as it exists today)

**Flow (synchronous, save-then-review):**
1. User clicks Review in the editor (`resources/js/components/admin/post-form.tsx`). It sets a `reviewAfterSave` ref and submits the existing Inertia `<Form>` (the normal `PostController::update` path).
2. On save success, `reviewAfterSuccessfulSave()` calls `postReview.run()`.
3. `resources/js/hooks/use-post-review.ts` uses Inertia's `useHttp` to POST `POST /admin/posts/{post:id}/review` (`routes/admin.php`, `PostReviewController`).
4. `app/Http/Controllers/Admin/PostReviewController.php` captures an authoring snapshot, calls `PostReviewService::review($post->content, $post->id)` **synchronously**, then persists under a `lockForUpdate()` row lock with collision detection, returning JSON.
5. `app/Services/PostReviewService.php` prompts the `BlogPostReviewer` agent (with one malformed-output retry), classifies failures, and logs a full safe lifecycle.

**Persistence model (columns on `posts`):**
- `latest_review` (JSON, nullable) — the structured notes.
- `latest_review_at` (timestamp, nullable) — when the review completed.
- `reviewIsStale()` on `Post` = literal `latest_review_at !== null && updated_at > latest_review_at`.
- Migration: `database/migrations/2026_08_04_060117_add_latest_review_to_posts_table.php`.
- Reviews are persisted with `Post::withoutTimestamps()` so `updated_at` is unchanged.

**Edit page wiring (`PostController::edit`):**
- Returns `post.review` = `{ notes, reviewedAt, isStale }` or `null`.

**Frontend:**
- `resources/js/hooks/use-post-review.ts` — owns `useHttp`, `reviewing`/`error` state, retained-review-on-failure.
- `resources/js/components/admin/post-review-panel.tsx` — never-reviewed / loading / notes / clean / stale / error / Retry states. Third column at `xl`, stacked below on narrower screens.
- The panel distinguishes server-provided review state from the latest standalone JSON result so consecutive reviews update immediately.

**Agent + diagnostics (already good — keep):**
- `app/Ai/Agents/BlogPostReviewer.php` — structured agent with `LogBlogPostReview` middleware.
- `app/Ai/Middleware/LogBlogPostReview.php` — provider/model/timeout/prompt-size/duration/usage logs.
- `app/Services/PostReviewService.php` — attempt/retry/success/failure logging, `failure_type` classification (connection / provider_http / invalid_response / runtime_timeout_mismatch / unexpected), safe HTTP status + request-ID extraction. Never logs prompts, notes, response bodies, credentials, or exception messages.

**Config:** `config/ai.php` → `ai.blog_review.{provider,model,timeout}` (defaults: anthropic, claude-sonnet-5, 120s). `.env.example` has `BLOG_REVIEW_AI_*`.

**Tests:** `tests/Feature/Admin/PostReviewTest.php` — 15 tests / 143 assertions, all using Laravel AI fakes, no live provider calls.

**Queue infra:** `QUEUE_CONNECTION=database` is set. There is **no `app/Jobs` directory** and **no queue worker process** in `devenv.nix` yet.

## Target architecture (for the grilling session to refine)

- A **queued job** owns the Anthropic call and persistence. It runs in a worker with no browser/proxy deadline.
- The Review button **dispatches the job** and returns immediately (fast request).
- The frontend uses **Inertia polling** (`usePoll` + partial reload of the review prop, `only: ['post.review']` or a dedicated deferred prop) to reflect status until the job completes or fails.

## Open design questions to grill

These are intentionally unresolved — the grilling session should decide them before any code:

1. **Persistence model.** The current two columns on `posts` cannot represent "a review is pending/in-flight." Options:
   - (a) A dedicated `post_reviews` table with `status` (pending/complete/failed), `reviewed_at`, notes, and a snapshot of the content it reviewed. The latest row drives the panel.
   - (b) Keep the columns and add a `review_status` / `review_dispatched_at` to `posts`.
   Which is cleaner, and how does it interact with the existing collision-detection snapshot logic?

2. **Staleness + collision semantics.** Today staleness is literal `posts.updated_at > latest_review_at`, and the controller rechecks a raw authoring snapshot under `lockForUpdate()`. In an async world:
   - When is the snapshot captured — at dispatch (save) time, or re-read inside the job?
   - What happens if the user saves again while a review is pending? Cancel the old job, let it finish and mark stale, or coalesce?
   - Keep the literal `updated_at`-based staleness, or move to snapshot-based?

3. **Failure surfacing.** Provider errors / timeouts / invalid output currently throw and return 503. In the job model, how is a failure surfaced to the panel — a persisted `failed` status with a retry action? Retries inside the job vs. user-initiated retry?

4. **Polling UX.** `usePoll` interval, `mode` (overlap/cancel/rest), when to start/stop polling (on dispatch → stop on complete/fail), and whether to use a deferred prop vs. `only` partial reload. Background-tab throttling (Inertia throttles polls 90% when hidden).

5. **Rate limiting + concurrency.** The 5/min throttle currently sits on the sync route. With dispatch, should we also prevent a second in-flight review for the same post (dedupe)?

6. **The runtime-timeout guard.** `PostReviewRuntimeTimeoutMismatch` was added for the sync path. In a worker, PHP's `max_execution_time` behaves differently (and a `queue:work` job has its own `--timeout`). Decide whether that guard still applies, moves, or is removed.

7. **Worker process.** Add a `queue:work` process to `devenv.nix`, and note the production worker requirement (Cloud background process / Horizon).

8. **Scope of changes.** This touches controller, service, models, migration(s), frontend hook + panel + form, routes, tests, and devenv. Should it be one task or split (backend job+persistence / frontend polling)?

## Constraints to preserve

- Review triggers from the **edit page only** (already-saved post), and Review still **saves first** via the existing update form.
- Body markdown only.
- One malformed-output retry server-side; provider errors are not retried automatically.
- Reviews persisted **without touching `posts.updated_at`**.
- **Safe logging only** — no prompts, notes, response bodies, credentials, headers, or exception messages. Keep the existing lifecycle/classified-failure logs.
- Automated tests use **Laravel AI fakes only**; no live Anthropic calls.
- Frontend keeps clean / stale / loading / retained-error / Retry UX semantics (adapted to async).

## Relevant files

Backend: `app/Http/Controllers/Admin/PostReviewController.php`, `app/Services/PostReviewService.php`, `app/Ai/Agents/BlogPostReviewer.php`, `app/Ai/Middleware/LogBlogPostReview.php`, `app/Models/Post.php`, `database/migrations/2026_08_04_060117_add_latest_review_to_posts_table.php`, `routes/admin.php`, `config/ai.php`.
Frontend: `resources/js/hooks/use-post-review.ts`, `resources/js/components/admin/post-review-panel.tsx`, `resources/js/components/admin/post-form.tsx`, `resources/js/pages/admin/posts/edit.tsx`, `resources/js/types/admin.ts`.
Tests: `tests/Feature/Admin/PostReviewTest.php`.
Infra: `devenv.nix`.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approved plan — queue the blog review + Inertia polling

Grilled and locked across the 8 open design questions. One task, two ordered phases, shipped as one changeset over a single `review` prop contract. Status stays To Do; no implementation started.

### Decisions (the 8 questions)

1. **Persistence — columns, not a table.** Add to `posts`: `review_status` (string enum `Pending|Completed|Failed|Superseded`, null = never reviewed) + `review_dispatched_at` (timestamp). Keep `latest_review` / `latest_review_at` unchanged as "last completed review". The dispatch-time authoring snapshot rides in the **job payload**, not a durable column — the committed sync code already treats the snapshot as throwaway request-scoped state, so a table would invent durability the design never wanted. New forward-only migration; rerun `ide-helper:models -RW`.

2. **Snapshot timing + second-save.** Snapshot captured at **dispatch time** in the controller (after the save-first update, on a refreshed post), using the existing `REVIEW_INVALIDATING_ATTRIBUTES` set — which already includes `content`. The job **reviews the content from the payload snapshot** (guarantees notes describe the exact revision the user clicked Review on), does a cheap pre-prompt snapshot recheck (early-out, no provider spend if already superseded), and re-reads under `lockForUpdate` to recheck the full snapshot before persisting — the existing collision guard relocated verbatim from controller into job. Second save while pending = **newest wins by snapshot**; the stale in-flight job discards. No explicit job cancellation.

3. **Terminal states — four, distinct.** `Superseded` is a first-class enum case (not folded into `Failed`).
   - *Completed* — notes persisted (empty list = "reads clean"), `withoutTimestamps`.
   - *Failed* — provider/connection/invalid-after-retry/timeout. The exception propagates; the job's `failed(Throwable)` handler writes `status = Failed`. Prior `latest_review`/`latest_review_at` untouched (retained-review invariant). Panel: error alert + Retry.
   - *Superseded* — snapshot mismatch, post still exists. Normal job return writing `status = Superseded`; prior notes retained (and now auto-stale). Panel: calm info ("post changed while reviewing — save & re-review"), not a red error.
   - *Deletion mid-review* — row gone; job no-ops; `failed()` guards for a missing row.
   - `tries = 1`; the single malformed-output retry stays inside `PostReviewService` unchanged; retry is **user-initiated only** via the existing save-first → dispatch sequence.

4. **Polling.** Lift `review` from `post.review` to a **top-level edit-page prop** `{ status, notes, reviewedAt, isStale }` so polling targets `only: ['review']` and never re-ships `post.content` per tick (small `PostController::edit` refactor). Hook uses `usePoll(2500, { only: ['review'] }, { mode: 'cancel', autoStart: false })`: optimistically set local `Pending` on the dispatch 202 and start; **resume on mount if server status is already `Pending`** (survives a page reload mid-review, backed by the durable column); stop on any terminal status. Partial reload, not a deferred prop. Keep default background throttling (no `keepAlive`).

5. **Rate limit + dedupe.** Keep `throttle:5,1` on the dispatch route (now throttles a cheap dispatch). **No `WithoutOverlapping`** — UI disables Review while `Pending`, and the snapshot recheck under lock is the actual correctness guarantee (wrong notes can never persist). `WithoutOverlapping(postId)->expireAfter(job_timeout)` noted as the extension point if this ever grows past a single operator.

6. **Runtime-timeout guard — retire + retarget.** CLI worker has `max_execution_time = 0`, so the existing `PostReviewRuntimeTimeoutMismatch` PHP-time guard is dead code in the sole execution context. Delete the exception class, the preflight check, the `php_max_execution_time_seconds` logging, and the committed `a_runtime_timeout_mismatch_is_logged...` test. Replace its invariant with the worker chain **`retry_after (180) > job_timeout (150) > ai_timeout (120)`**, add `#[FailOnTimeout]`, and **retarget the guard's intent**: a pre-prompt assertion inside the job that `ai_timeout < job_timeout`, else throw a classified misconfiguration → `Failed`, safe log, no provider spend. `job_timeout` comes from `config('ai.blog_review.job_timeout')` (no magic number). `pcntl` confirmed available, so SIGALRM job timeouts are enforceable.

7. **Worker + infra.** devenv: add `queue.exec = "php artisan queue:listen --tries=1 --timeout=150"` (`listen`, not `work`, to avoid the stale-code footgun locally; job fires only on manual clicks so per-job boot cost is irrelevant). Production: documented prerequisite of a `queue:work` background process on Laravel Cloud (Horizon only if queues move to Redis). Add `DB_QUEUE_RETRY_AFTER=180` to `.env.example` with a comment tying it to the 180>150>120 chain. `jobs`/`job_batches`/`failed_jobs` tables already exist — no queue migration. Tests never run a worker: `Queue::fake()` at the controller (assert dispatched with postId+snapshot and `status = Pending`) + direct `ReviewPost::handle()` tests with `BlogPostReviewer::fake(...)` for the Completed/Failed/Superseded/clean/mismatch transitions. Fakes-only preserved.

8. **Scope — one task, two phases.** The controller contract break (sync `{review}` → bare `202`) makes a backend-only split ship a *regression* (stuck spinner), so no independent-shipping split. Ship as one changeset.
   - **Phase A (backend):** migration + `PostReviewStatus` enum + `ReviewPost` job + controller→dispatch rewrite + retargeted timeout guard + timeout config (`ai.blog_review.job_timeout`) + devenv `queue` process + `DB_QUEUE_RETRY_AFTER` + backend tests.
   - **Phase B (frontend):** lift `review` prop + `use-post-review` rewrite to `usePoll` + panel status states incl. `Superseded` + form wiring + `types/admin.ts` + FE checks (types/lint/fmt).

### Preserved constraints
Edit-only trigger; save-first via the existing update form; body markdown only; one malformed-output retry (in service); reviews persisted without touching `posts.updated_at`; safe logging only (no prompts/notes/bodies/credentials/exception messages); AI fakes only in tests; clean/stale/loading/retained-error/Retry UX carried across to async plus the new `Superseded` state.

### Validation gates (unchanged project bar)
`vendor/bin/pint`, Rector, PHPStan/Larastan, focused `PostReviewTest` + new job tests, Wayfinder + `ide-helper:models -RW` regeneration, `pnpm types:check`/`lint:check`/`fmt:check`, production Vite build.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Context loaded by parent before implementation: read JOEY-18/18.1/18.2 plans, all 14 target files (controller, service, agent, middleware, model, enums, exceptions, routes, configs, migration, PostController::edit, all frontend hook/panel/form/edit/types, the markdown-editor reviewPanel wiring), PostReviewTest (15 tests), devenv.nix, .env.example. Verified the two locked-plan API surfaces against installed packages: (1) usePoll signature `usePoll(interval, requestOptions|fn, {autoStart?,keepAlive?,mode?:'overlap'|'cancel'|'rest'})` returns {start,stop} on @inertiajs/react@3.6.1 — confirms `usePoll(2500,{only:['review']},{mode:'cancel',autoStart:false})` is valid; (2) Laravel 13 queue attributes #[FailOnTimeout] / #[Tries] / $timeout / failed(Throwable) on Queueable jobs, plus Queue::fake()+assertPushed() for dispatch tests and direct handle() for job behavior. Confirmed jobs/job_batches/failed_jobs tables already exist (no queue migration), review Wayfinder route exists at @/routes/admin/posts, and Queueable base is available (no app/Jobs dir yet). Plan decision questions are locked; implementation proceeding in two ordered phases (A backend, B frontend) as one changeset.
<!-- SECTION:NOTES:END -->
