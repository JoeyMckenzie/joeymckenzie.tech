---
id: JOEY-5.2
title: Markdown editor with server-rendered preview and image upload
status: Done
assignee: []
created_date: '2026-07-29 23:16'
updated_date: '2026-07-31 23:22'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-5.1
  - JOEY-6
  - JOEY-7
references:
  - docs/adr/0004-admin-authors-markdown-with-server-rendered-preview.md
modified_files:
  - app/Http/Controllers/Admin/PostImageController.php
  - app/Http/Controllers/Admin/PostPreviewController.php
  - app/Http/Requests/Admin/PostImageRequest.php
  - app/Http/Requests/Admin/PostPreviewRequest.php
  - package.json
  - pnpm-lock.yaml
  - routes/admin.php
  - resources/js/components/admin/markdown-editor.tsx
  - resources/js/components/admin/post-form.tsx
  - resources/js/components/blog/rendered-markdown.tsx
  - resources/js/hooks/use-markdown-preview.ts
  - resources/js/hooks/use-post-image-upload.ts
  - resources/js/pages/admin/posts/create.tsx
  - resources/js/pages/admin/posts/edit.tsx
  - resources/js/pages/blog/show.tsx
  - tests/Feature/Admin/PostImageUploadTest.php
  - tests/Feature/Admin/PostPreviewTest.php
parent_task_id: JOEY-5
priority: high
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The post editor UI within admin CRUD (JOEY-5.1): a CodeMirror-based markdown-source editor with a live preview pane rendered by the server-side MarkdownRenderer (JOEY-6), so the preview is byte-identical to the published page (docs/adr/0004) — same Phiki highlighting and Mermaid handling. Debounce the content and POST it to an admin-only preview endpoint that returns content_html. Drag-drop / toolbar image upload runs the R2 + Intervention pipeline (JOEY-7) and inserts the returned ![](url) markdown at the cursor. This is deliberately a markdown editor, NOT a rich-text WYSIWYG (docs/adr/0004).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A CodeMirror markdown-source editor with syntax highlighting is embedded in the post create/edit screen
- [x] #2 A live preview pane renders via an admin-only server preview endpoint using the same MarkdownRenderer as publishing (Phiki + Mermaid), debounced, and matches the published output
- [x] #3 Image upload (drag-drop or toolbar) processes via the R2 pipeline and inserts the returned image markdown at the cursor
- [x] #4 The preview and upload endpoints are gated to auth + verified
- [x] #5 Tests cover: the preview endpoint returns rendered HTML and is auth-gated; the upload endpoint stores via the pipeline and returns a usable URL
- [x] #6 composer fmt/lint/refactor and frontend lint checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Approved 2026-07-31. CodeMirror markdown editor + server-rendered preview + inline image upload, per ADR 0004.

## Approved dependency

`@uiw/react-codemirror` + `@codemirror/lang-markdown` (2 direct deps). The wrapper owns the imperative `EditorView` lifecycle, which matters because `app.tsx` sets `strictMode: true` and React 19 double-invokes effects in dev.

## The load-bearing decision

"Byte-identical to the published page" is already true server-side (one `MarkdownRenderer`) but NOT client-side: `blog/show.tsx` owns a non-trivial Mermaid lifecycle (stash sources, reset `data-processed`, re-run on appearance change) that a second copy in the preview pane would drift from. So extract `resources/js/components/blog/rendered-markdown.tsx` owning `dangerouslySetInnerHTML` + the entire Mermaid effect, and have BOTH `blog/show.tsx` and the admin preview pane render it. One renderer, one Mermaid path.

## Backend (single-action controllers, JSON, matching HomeController/PostReactionController conventions)

| Route | Controller | Returns |
|---|---|---|
| `POST admin/posts/preview` (`admin.posts.preview`) | `Admin\PostPreviewController` | `{ html }` from the same `MarkdownRenderer` |
| `POST admin/posts/images` (`admin.posts.images.store`) | `Admin\PostImageController` | `{ url }` absolute, per ADR 0002 |

Both inside the existing `['auth','verified']` group in `routes/admin.php`. Upload validates `image|max:8192` plus a nullable `slug`, and runs `ImageProcessor::store($file, $slug ?: 'drafts')` — the `drafts` fallback covers uploading before a new post has a slug, and since inline images are referenced by absolute URL the object path is organisational only. Upload gets `throttle:60,1` (it re-encodes images); preview gets no throttle — it is debounced and single-operator, and a 429 mid-typing is worse than the risk. `MarkdownRenderer` throwing `CommonMarkException` is left to bubble exactly as it does on publish; the preview hook absorbs the failure by keeping the last good HTML.

## Frontend

- `hooks/use-markdown-preview.ts` and `hooks/use-post-image-upload.ts`, both on Inertia v3 `useHttp` (`.ai/react_rules` requires transport in hooks and prefers Inertia primitives; the older raw-fetch + manual-XSRF pattern in `reactions.tsx` is deliberately NOT copied). Each absorbs its own failures.
- `components/admin/markdown-editor.tsx` replaces the textarea INSIDE `post-form.tsx`, keeping a hidden `<textarea name="content">` synced to the CodeMirror doc so `<Form>` serialisation and the 5.1 `PostRequest` contract are untouched — no change to the save path.
- Toolbar button, drag-drop, and paste-image all insert `![](url)` at the cursor via a CodeMirror dispatch.
- Editor | preview side by side at `lg`, tabbed below. Preview renders on `bg-canvas` with `prose-nocturne` (those tokens are global in `app.css`), so it looks like the published article rather than merely containing the same HTML. Create/edit containers widen for the split.

## Tests

`tests/Feature/Admin/PostPreviewTest.php` and `PostImageUploadTest.php`: auth gating on both, rendered-HTML assertions (h1/strong, Phiki `<pre`, `<div class="mermaid">`), upload stores a WebP on the faked disk and returns a usable URL, non-image and oversized rejected, slug fallback. Plus the assertion that matters most: the preview endpoint's HTML for a given markdown is IDENTICAL to what `store` persists into `content_html` — ADR 0004 as an executable guarantee.

## Verify

`composer test`, `pnpm fmt:check && lint:check && types:check`, then a browser smoke test of typing -> preview, drag-drop upload, and a mermaid fence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
**ADR 0004 is now an executable guarantee, not a comment.** `PostPreviewTest` asserts with `assertSame` that the HTML returned by `admin.posts.preview` is byte-for-byte identical to the `content_html` that `admin.posts.store` persists, for markdown containing a heading, bold text, a ```php fence and a ```mermaid fence. It held without weakening to `assertStringContainsString` — Phiki injects nothing non-deterministic (no nonces, ids, or hashes).

Phiki's real output, so future readers know what the assertions are pinned to:
`<pre class="phiki language-php tokyo-night" data-language="php" style="background-color: #1a1b26;color: #a9b1d6;">` with per-token `<span class="token" style="color: #bb9af7;">`. If the theme moves off TokyoNight, the class-string assertion is the one that fails first. Mermaid emits `<div class="mermaid">graph TD;\nA-->B;\n</div>` with the source **raw and unescaped** (`A-->B;`, not `A--&gt;B;`), and deliberately does not pick up Phiki's classes — the test exercises that renderer priority.

**Two bugs, both at boundaries the happy path sails past, both found by writing the tests independently of the implementation.**

1. **An emptied editor 422'd instead of previewing empty.** Laravel's global `ConvertEmptyStringsToNull` rewrites `content: ""` to null *before* validation, so `['present','string']` failed on null — precisely the case `present` (rather than `required`) was chosen to allow. Fixed with a `prepareForValidation()` in `PostPreviewRequest`, with a comment naming the middleware so nobody "simplifies" it back.

2. **The first fix silently ate the `present` rule.** The guard was `$this->input('content') === null`, which cannot distinguish "sent as empty" from "key absent" — `input()` returns null for both — so the merge always fired and a missing `content` key started returning 200 instead of a validation error. Corrected to `$this->exists('content') && $this->input('content') === null`. Both boundaries now hold, each with its own test.

**Frontend design notes.**

- `components/blog/rendered-markdown.tsx` is the load-bearing extraction: it owns `dangerouslySetInnerHTML` plus the entire Mermaid lifecycle (source stashing, `data-processed` reset, re-run on theme change), and BOTH `blog/show.tsx` and the admin preview pane render it. Without this, the client half of "byte-identical" would have been two copies drifting apart. It renders an `<article>`, so `blog/show.tsx` output is unchanged (live DOM check: `tag: ARTICLE, className: "prose-nocturne mt-10"`).
- Both hooks use Inertia v3 `useHttp`, not `fetch`. Worth recording: `useHttp`'s promise resolves with parsed JSON on 2xx, resolves with `undefined` on 422 (while typed as `TResponse` — a lie), and **rejects** on cancellation, network error, and non-422 non-2xx. Both hooks therefore `.catch()`, and the image hook is typed `ImageResponse | undefined` so the 422 path is a real check rather than a runtime TypeError. `useHttp` also switches to multipart automatically when the payload contains a `File`, and Inertia's client handles XSRF itself.
- The hidden `<textarea name="content">` keeps the 5.1 save path untouched: Inertia's `<Form>` serialises via `new FormData(formElement)`, and the HTML form-data set excludes only *disabled* controls, so a `hidden readOnly` field is still submitted. `required` was deliberately NOT carried over — Chrome refuses to submit a form with an unfocusable required control ("An invalid form control with name='content' is not focusable"); `PostRequest` still validates server-side and `errors.content` still renders.
- CodeMirror's own `handlers.drop` reads dropped files with FileReader and inserts their **bytes as text**, so a bubble-phase React handler would be too late and an image drop would dump binary noise into the document. The editor claims image payloads in the capture phase (`onDragOverCapture`/`onDropCapture`/`onPasteCapture`); CM6 checks `event.defaultPrevented` before running its own handlers.
- `eslint-plugin-react-hooks` v7's `set-state-in-effect` rule forbade the first draft's synchronous `setState` for the empty-buffer case; the empty case is now derived rather than stored, which also removed a redundant `pending` state in favour of `useHttp`'s own `processing`.
- The first preview request fires undebounced and subsequent edits debounce at 400ms, so the edit page fills its pane immediately instead of showing ~400ms of blank preview for content it already has. No backend prop was added.

**Verification.** `composer test` green: 146 tests, 669 assertions, phpstan level max, rector, pint. `pnpm fmt:check`/`lint:check`/`types:check` clean.

Browser smoke test of the real editor: exactly ONE `.cm-editor` mounts (the StrictMode double-mount the `@uiw` wrapper was chosen to avoid); typing 44 characters produced exactly ONE preview request (debounce holding) and the pane rendered a server-side `<h1>` and `<strong>`; a pasted document with a ```php fence rendered Phiki markup with inline token colours identical to the published page, and a ```mermaid fence rendered to real SVG in the preview; a toolbar upload returned 200 with a `.webp` URL bucketed under `posts/editor-upload-probe/` and inserted `![](url)` at the cursor; emptying the buffer produced no 4xx and showed the empty-state hint; the Write/Preview toggle renders at 640px.

No residue: post count back to 32, all probe objects deleted from the image disk, operator's `email_verified_at` untouched.

**Environment note.** The `devenv` process manager died mid-session (during the frontend slice) and was temporarily replaced with hub-supervised stand-ins on the same ports. Both were stopped and `devenv up -d` restored `app`, `pail`, and `vite` to ready.

Worth knowing for anyone driving devenv from an agent shell: `vite` initially came back as `gave_up` after 5 restarts, and the cause was NOT the OOM it looked like — `laravel-vite-plugin` hard-refuses to start the HMR server when it sees `CI` in the environment ("You should not run the Vite HMR server in CI environments"), and this session's shell has `CI=1`. Relaunching with `env -u CI devenv up -d` fixed it. Either unset `CI` or set `LARAVEL_BYPASS_ENV_CHECK=1` when starting devenv from an agent context.

**Pre-existing issue, not fixed, not in scope.** `hooks/use-appearance.tsx` never calls `notify()` from `handleSystemThemeChange`, so an OS-level `prefers-color-scheme` flip toggles the `dark` class without re-rendering React. Mermaid therefore re-themes only on an explicit appearance click, not on an OS change. This predates 5.2 — `blog/show.tsx` already had the same `[resolvedAppearance]` dependency — and the extraction preserves the existing behaviour exactly rather than changing it.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The post editor is now a CodeMirror markdown-source editor with a live preview rendered by the server, and inline image upload, per ADR 0004.

Two new endpoints inside the existing `['auth','verified']` admin group: `POST admin/posts/preview` returns `{ html }` from the same `MarkdownRenderer` that publishing uses, and `POST admin/posts/images` (`throttle:60,1`) runs the R2 + WebP pipeline and returns `{ url }` — absolute, because inline body images live in free-text markdown, while covers keep their object key (ADR 0002). Uploads bucket under the live slug, or `posts/drafts/` for a post that has not been saved yet.

The piece that makes the ADR hold is `components/blog/rendered-markdown.tsx`: one component owning the rendered HTML and the whole Mermaid lifecycle, shared by the public post page and the admin preview pane. Server-side there was already one `MarkdownRenderer`; client-side there is now one Mermaid path, so the two cannot drift. And `PostPreviewTest` pins it down — `assertSame` between the preview endpoint's HTML and the `content_html` that `store` persists, which held byte-for-byte without weakening.

The editor keeps a hidden `<textarea name="content">` synced to the CodeMirror doc, so the JOEY-5.1 save path and `PostRequest` are completely untouched. Image insertion works from the toolbar, drag-and-drop, and clipboard paste, all inserting `![](url)` at the cursor — the drop and paste paths intercept in the capture phase because CodeMirror's own drop handler would otherwise insert the file's raw bytes as text.

17 new tests (146 total, 669 assertions) cover auth gating on both endpoints, real Phiki and Mermaid output, the empty-content and missing-key boundaries, upload prefixes, WebP magic bytes on the stored object, and the byte-identical guarantee. Writing them independently of the implementation caught two real bugs in the preview request's empty-content handling, both now regression-tested.
<!-- SECTION:FINAL_SUMMARY:END -->
