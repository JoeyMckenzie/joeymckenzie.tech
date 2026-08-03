---
id: JOEY-18
title: Add in-app blog post review agent
status: To Do
assignee: []
created_date: '2026-08-03 20:34'
updated_date: '2026-08-03 21:31'
labels:
  - feature
  - ai
  - blog
dependencies: []
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
- [ ] #1 A Review button is present in the post editor on the edit page only (not on create); it is absent/disabled for an unsaved post
- [ ] #2 Clicking Review saves the current editor buffer via the existing update path first, then triggers the review against the saved revision
- [ ] #3 The review runs via a dedicated authenticated JSON endpoint POST /admin/posts/{post}/review that reads the latest content from the database
- [ ] #4 The agent is implemented with the laravel/ai SDK, composed as an agent, with provider/model configurable via config + env and defaulting to the latest Anthropic Claude Sonnet
- [ ] #5 The agent reviews the post body markdown only and returns notes in a fixed schema: category, excerpt, comment, suggestion
- [ ] #6 Note categories are limited to Clarity, Conciseness, Flow, and Tone
- [ ] #7 Returned notes render as structured notes in a side panel alongside the editor
- [ ] #8 When the agent returns no notes, the panel shows a positive empty state ('reads clean') with the reviewed-at timestamp
- [ ] #9 The latest review and its timestamp are persisted on the posts table (nullable latest_review JSON + latest_review_at) via a new forward-only migration
- [ ] #10 The panel shows a staleness marker when posts.updated_at is newer than latest_review_at
- [ ] #11 A model response that fails the notes schema is retried once server-side before an error is surfaced
- [ ] #12 On review failure (provider error/timeout/invalid output), the save still stands, the panel shows an error state with a Retry button and a toast, and any previously persisted review remains visible
- [ ] #13 The review route is rate-limited consistently with the existing preview/image endpoints
- [ ] #14 Feature tests use the laravel/ai fake provider (no network calls) and cover: happy path persisting and returning notes, auth required, provider-error path surfacing an error, and the staleness flag
- [ ] #15 PHP is formatted with pint and passes lint/refactor checks; frontend passes types:check, lint:check, and fmt:check
<!-- AC:END -->
