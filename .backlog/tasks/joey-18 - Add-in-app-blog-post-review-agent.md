---
id: JOEY-18
title: Add in-app blog post review agent
status: Done
assignee:
  - Pi
created_date: '2026-08-03 20:34'
updated_date: '2026-08-04 16:37'
labels:
  - feature
  - ai
  - blog
dependencies: []
modified_files:
  - .env.example
  - composer.json
  - composer.lock
  - config/ai.php
  - app/Ai/Agents/BlogPostReviewer.php
  - app/Enums/PostReviewCategory.php
  - app/Exceptions/InvalidPostReview.php
  - app/Services/PostReviewService.php
  - app/Http/Controllers/Admin/PostReviewController.php
  - app/Http/Controllers/Admin/PostController.php
  - app/Models/Post.php
  - database/migrations/2026_08_04_060117_add_latest_review_to_posts_table.php
  - routes/admin.php
  - resources/js/hooks/use-post-review.ts
  - resources/js/components/admin/post-review-panel.tsx
  - resources/js/components/admin/markdown-editor.tsx
  - resources/js/components/admin/post-form.tsx
  - resources/js/pages/admin/posts/edit.tsx
  - resources/js/types/admin.ts
  - tests/Feature/Admin/PostReviewTest.php
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add an in-app agent that reviews the blog post currently being edited and returns constructive, line-editor-style feedback on the writing. The reviewer runs from the admin post editor and surfaces structured notes in a side panel for the author to act on.

Built with the official Laravel AI SDK (`laravel/ai`), composed as an agent, with structured output validated by the SDK.

## Behavior

**Trigger & availability**
- Manual "Review" button, available on the EDIT page only (an already-saved post — draft or published). No button on the create page, since save (and thus review) requires a valid title/slug/tag.
- Clicking Review saves the current editor buffer first, then reviews the just-saved revision. This avoids live-buffer/DB drift and guarantees a persisted post to attach the review to.

**Flow — two sequential requests**
1. Submit the existing update form (reuses all current save logic: `content_html` render, reading-time calc, blog cache clear — no duplication).
2. On save success, a `useHttp` POST to a dedicated JSON endpoint `POST /admin/posts/{post}/review` (modeled on `PostPreviewController`). It takes the post id, reads the latest content from the DB, runs the agent, persists + returns the notes as JSON. Loading state lives in the review panel.
- Scope: body markdown only (not title/description).

**The agent**
- `laravel/ai`, composed as an agent. Provider/model configurable via config + env; default to the latest Anthropic Claude Sonnet. API key in `.env`.
- Editorial voice: constructive line-editor that flags issues, explains why, and suggests fixes while respecting the author's voice.
- If the model returns output that fails the notes schema, retry once server-side before surfacing an error.

**Note shape & categories**
- Each note carries: `category`, `excerpt` (the text it refers to), `comment` (why it's an issue), `suggestion` (a concrete rewrite/fix).
- Category set: Clarity, Conciseness, Flow, Tone. No grammar/mechanics nagging.

**Display — side panel**
- Structured notes shown in a dedicated panel alongside the editor/preview.
- Positive empty state ("reads clean") with the reviewed-at timestamp when the agent finds nothing to flag.
- Staleness marker when `posts.updated_at` is newer than `latest_review_at` ("content changed since this review").

**Persistence**
- New migration adding nullable `latest_review` (JSON — the structured notes) and `latest_review_at` (timestamp) columns to `posts`. One-to-one, latest review only.

**Failure handling**
- The save runs first and succeeds independently, so content is never at risk. A review failure (provider error, timeout, invalid output after retry) shows a clear panel error state with a Retry button plus a toast. Any previously persisted review stays visible.

**Guards**
- Light rate limit on the review route, consistent with the existing preview/image endpoints.

## Risks / notes
- `laravel/ai` is a young package on Laravel 13 / PHP 8.5 — pin a known-good version.
- LLM latency is ~10–30s for a blocking call; verify no proxy/PHP execution timeout severs the request in the deployment environment.

## Relevant existing code
- Editor: `resources/js/components/admin/post-form.tsx`, `resources/js/components/admin/markdown-editor.tsx`, `resources/js/pages/admin/posts/edit.tsx`
- Preview pattern to mirror: `app/Http/Controllers/Admin/PostPreviewController.php`, `resources/js/hooks/use-markdown-preview.ts`
- Model & routes: `app/Models/Post.php`, `routes/admin.php`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A Review button is present in the post editor on the edit page only (not on create); it is absent/disabled for an unsaved post
- [x] #2 Clicking Review saves the current editor buffer via the existing update path first, then triggers the review against the saved revision
- [x] #3 The review runs via a dedicated authenticated JSON endpoint POST /admin/posts/{post}/review that reads the latest content from the database
- [x] #4 The agent is implemented with the laravel/ai SDK, composed as an agent, with provider/model configurable via config + env and defaulting to the latest Anthropic Claude Sonnet
- [x] #5 The agent reviews the post body markdown only and returns notes in a fixed schema: category, excerpt, comment, suggestion
- [x] #6 Note categories are limited to Clarity, Conciseness, Flow, and Tone
- [x] #7 Returned notes render as structured notes in a side panel alongside the editor
- [x] #8 When the agent returns no notes, the panel shows a positive empty state ('reads clean') with the reviewed-at timestamp
- [x] #9 The latest review and its timestamp are persisted on the posts table (nullable latest_review JSON + latest_review_at) via a new forward-only migration
- [x] #10 The panel shows a staleness marker when posts.updated_at is newer than latest_review_at
- [x] #11 A model response that fails the notes schema is retried once server-side before an error is surfaced
- [x] #12 On review failure (provider error/timeout/invalid output), the save still stands, the panel shows an error state with a Retry button and a toast, and any previously persisted review remains visible
- [x] #13 The review route is rate-limited consistently with the existing preview/image endpoints
- [x] #14 Feature tests use the laravel/ai fake provider (no network calls) and cover: happy path persisting and returning notes, auth required, provider-error path surfacing an error, and the staleness flag
- [x] #15 PHP is formatted with pint and passes lint/refactor checks; frontend passes types:check, lint:check, and fmt:check
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approved implementation plan

1. **SDK and configuration**
   - Pin `laravel/ai` to `0.10.1`.
   - Publish/configure `config/ai.php` without conversation-storage migrations.
   - Add `BLOG_REVIEW_AI_PROVIDER`, `BLOG_REVIEW_AI_MODEL`, and `BLOG_REVIEW_AI_TIMEOUT` to `.env.example`, defaulting to Anthropic, `claude-sonnet-5`, and 60 seconds.

2. **Agent and review service**
   - Generate a structured `BlogPostReviewer` agent.
   - Define the four-category schema and constructive line-editor instructions.
   - Add a service that prompts with body markdown only and retries schema-invalid output once.
   - Surface provider, timeout, and schema failures through a generic JSON error without logging post content or secrets.

3. **Persistence and endpoint**
   - Add a forward-only migration for nullable `latest_review` JSON and `latest_review_at` timestamp columns.
   - Add model casts/types and regenerate model IDE metadata.
   - Add authenticated `POST /admin/posts/{post:id}/review`, generated Wayfinder route support, and `throttle:5,1`.
   - Persist review fields without touching `posts.updated_at` so a fresh review is not immediately stale.
   - Return notes, reviewed timestamp, and staleness state.

4. **Existing edit response**
   - Include the latest review in `PostController::edit`.
   - Compute staleness literally from `posts.updated_at > latest_review_at`, including metadata-only saves.

5. **Frontend review flow**
   - Add a `use-post-review.ts` hook to own `useHttp`, loading, success, retained-review, and failure state.
   - Programmatically submit the existing Inertia `<Form>` when Review or Retry is clicked.
   - Trigger the JSON review request only from the save-success callback; never review after save validation fails.
   - Keep previously persisted notes visible when a later review fails.

6. **Review panel**
   - Add a dedicated panel with never-reviewed, loading, notes, clean, stale, and error states.
   - Use a third desktop column for source / preview / review and widen only the edit page; stack review below the writing surface on narrower screens.
   - Keep Review absent from create and route Retry through the same save-first sequence.

7. **Tests and validation**
   - Add feature coverage for success/persistence, body-only prompting, authentication, rate limiting, schema retry, provider failure, retained review, and staleness.
   - Use Laravel AI SDK fakes only; do not make a live provider request.
   - Regenerate Wayfinder types and model IDE metadata.
   - Run focused PHPUnit tests, Pint, lint/refactor checks, TypeScript checks, ESLint, and Prettier.

## Approved decisions

- Desktop third-column review panel; stacked on narrower screens.
- Rate limit: five review requests per minute per authenticated user.
- Exact SDK pin: `laravel/ai:0.10.1`.
- Defaults: Anthropic, `claude-sonnet-5`, 60-second timeout.
- Preserve literal `posts.updated_at` staleness behavior.
- Automated validation uses SDK fakes only.

## Subagent ownership and sequencing

1. Parallel read-only SDK/API research and integration-risk review.
2. One async `worker` is the sole writer for the active worktree and implements the approved plan.
3. Parallel fresh-context reviewers cover Laravel/AI correctness, Inertia/React UX and accessibility, and acceptance/test completeness.
4. The parent synthesizes findings and launches one fix worker if needed.
5. The parent performs final diff inspection, validation, Backlog updates, and task finalization.

### Implementation refinements

- The blocking review call now captures a raw snapshot of all review-invalidating authoring fields and rechecks it under a row lock before persistence. This prevents stale notes from being attached even when two saves share the database timestamp's one-second precision.
- Client review state distinguishes the latest Inertia-provided server review from the latest standalone JSON result, allowing consecutive successful reviews to update immediately while an ordinary later save still surfaces server-computed staleness.
- The action group wraps at narrow widths, and the review panel is exposed as a labelled accessible region.

Follow-up subtask JOEY-18.1 (owner: Pi) addresses live-provider timeout variability and safe operational logging after the core review feature. It runs after JOEY-18 and does not change review UX or persistence semantics.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Discovery started. Confirmed laravel/ai is not yet installed; current editor uses Inertia <Form> with CodeMirror mirrored into a hidden textarea, PostController::update redirects back to edit, and useHttp already powers JSON preview/image hooks. Open implementation questions are being resolved with the user before recording the plan or changing code.

User approved the implementation plan and clarified defaults, layout, throttling, staleness semantics, and fake-only provider validation. Implementation may begin.

Implementation completed through a sole-writer worker plus independent backend, frontend, acceptance, and final review gates. Reviews found and resolved an atomic persistence race, same-second timestamp collision, consecutive-review display bug, narrow action-bar overflow, accessibility semantics, schema-validation coverage, and frontend formatting churn.

Final validation passed: focused PostReviewTest (11 tests, 55 assertions), complete composer ci:check (163 tests, 794 assertions), Pint, Rector, PHPStan, ESLint, Prettier, TypeScript, Composer validation, route inspection, production Vite build, git diff whitespace check, and no staged files. No live Anthropic request was made by design. Existing optional Fontaine and bundle chunk-size build warnings remain operational/non-blocking.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Summary

Added an authenticated, in-editor blog post review workflow powered by the official Laravel AI SDK. The edit-only Review action first submits the existing post update form, then reviews the persisted body markdown through a dedicated JSON endpoint. Structured notes are persisted as the latest review and rendered in a responsive third editor panel with clean, stale, loading, retained-error, and Retry states.

## Backend

- Pinned `laravel/ai` to `0.10.1` and added configurable Anthropic provider, `claude-sonnet-5` model, and timeout settings.
- Added a structured `BlogPostReviewer` agent with Clarity, Conciseness, Flow, and Tone notes.
- Added application-level output validation and one retry for malformed structured responses; provider failures are not retried.
- Added nullable review JSON/timestamp persistence, literal staleness calculation, authenticated id-bound route, and five-per-minute throttle.
- Persisted reviews without changing `posts.updated_at`.
- Protected blocking reviews from concurrent edits/deletion using a raw authoring snapshot rechecked under a row lock, including same-second timestamp collisions.
- Kept logs and client errors free of prompt content, responses, credentials, and provider details.

## Frontend

- Reused Inertia's existing multipart update form for save-then-review sequencing.
- Added a `useHttp` review hook that retains prior notes on failure and supports consecutive reviews without stale client state.
- Added an accessible responsive review panel alongside source and preview at wide widths, stacking below on narrower screens.
- Added positive clean state, reviewed timestamp, stale warning, single error toast, and save-first Retry behavior.
- Kept the Review action absent from create pages and made the sticky action group wrap on narrow viewports.

## Tests and validation

- Added SDK-faked feature coverage for persistence/JSON response, body-only prompts and configured defaults, clean reviews, authentication, throttling, malformed output retry/exhaustion, invalid categories, provider failure retention, metadata staleness, unchanged timestamps, same-second concurrent edits, and deletion races.
- Focused suite: 11 tests / 55 assertions.
- Full `composer ci:check`: 163 tests / 794 assertions.
- Pint, Rector, PHPStan, ESLint, Prettier, TypeScript, Composer validation, route inspection, production Vite build, and diff checks passed.

## Residual operational checks

No live Anthropic request was made, as approved. Provider-account model availability and deployment proxy/PHP timeout behavior remain production environment checks. The Vite build retains existing non-blocking optional Fontaine and bundle chunk-size warnings.
<!-- SECTION:FINAL_SUMMARY:END -->
