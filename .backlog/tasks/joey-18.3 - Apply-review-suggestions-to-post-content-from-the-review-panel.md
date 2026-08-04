---
id: JOEY-18.3
title: Apply review suggestions to post content from the review panel
status: Done
assignee:
  - Pi
created_date: '2026-08-04 23:02'
updated_date: '2026-08-04 23:42'
labels:
  - feature
  - ai
  - blog
dependencies: []
references:
  - .backlog/tasks/joey-18 - Add-in-app-blog-post-review-agent.md
  - >-
    .backlog/tasks/joey-18.2 -
    Move-blog-post-review-to-a-background-job-with-Inertia-polling.md
documentation:
  - 'https://inertiajs.com/docs/v3/the-basics/manual-visits'
  - 'https://laravel.com/docs/13.x/ai-sdk'
parent_task_id: JOEY-18
priority: medium
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Motivation

The in-app blog review (JOEY-18 / 18.2) surfaces per-note feedback — a quoted `excerpt`, a "Why" (`comment`), and a "Try" (`suggestion`) — but acting on a note is fully manual: the author reads the advice and retypes the fix themselves. This task adds a per-note **Apply** affordance so a concrete, verbatim rewrite can be dropped straight into the editor with one click, then saved and (optionally) re-reviewed through the existing flow.

## Approved design (grilled with docs; decisions locked)

**1. Client-side buffer edit, NOT a server patch + reload.** Apply is a targeted CodeMirror transaction on the live editor `doc` — no new endpoint, no partial reload, no server-side content mutation. Rationale: `MarkdownEditor` seeds `doc` from `defaultValue` once (`resources/js/components/admin/markdown-editor.tsx`) and renders local state, so a `router.reload({only:['post']})` (which uses `preserveState:true`) would NOT flow new content into the editor; a server patch would also clobber unsaved edits and lose native undo. The verbatim replacement text still comes from the server in the review notes; only *applying* it is local. This gives free CodeMirror undo and makes "shows up in the editor" literally true with no reload.

**2. Note gains one OPTIONAL field, `replacement`.** Note becomes `{category, excerpt, comment, suggestion, replacement?}`. `excerpt` = exact text to find, `replacement` = exact drop-in text to write. "Why" (`comment`) and "Try" (`suggestion`) are unchanged. The agent emits `replacement` ONLY for precise, localized swaps and omits it for structural/global notes (which stay advice-only, no Apply). Optional (not `->required()`) also means legacy persisted notes with no `replacement` key fall into the advice-only path for free — no migration.

**3. Matching: exact substring, first occurrence, disable-on-no-match.** No fuzzy/normalized matching (would break the "you see exactly what changes" trust). If `excerpt` is not present in the live buffer, Apply is proactively disabled for that note with a "This passage has changed — re-review" state. Multiple occurrences → apply the first (blast radius is visible in the Rewrite block).

**4. Wiring — Package 3: render the panel inside the editor.** Move `PostReviewPanel` rendering INTO `MarkdownEditor`, which takes typed review props instead of the current prebuilt `reviewPanel` ReactNode slot. This co-locates match-detection and the targeted apply with the `doc`/`view` they need. `post-form.tsx` passes review data (from `usePostReview`) down as props.

**5. "Applied" is ephemeral client state.** Applying flips a note to an affirmative "Applied ✓" state (distinct from the "passage changed" disabled state), tracked in local component state and reset when a new review lands (keyed off the review identity the hook already tracks via `dispatchedAt`/`reviewedAt`). Server `latest_review` JSON is never mutated. Staleness logic is unchanged.

**6. Presentation + apply UX.** Add a "Rewrite" block after "Try" rendering `replacement` as literal monospace text (reads before → after alongside the excerpt quote), with Apply beneath. On Apply: dispatch the replace, select + scroll the new range into view, flip to "Applied ✓". Native CodeMirror undo reverts. No busy-gating (notes only render when settled; `showNotes` requires `!busy`). No save-first — Save regenerates `content_html`/reading-time through the normal `PostController::update` path.

**7. Testing.** Backend PHPUnit proves `replacement` persists through `PostReviewService`/`ReviewPost` (via `BlogPostReviewer::fake` notes carrying `replacement`) and surfaces in `PostController::edit`'s `review.notes`. Frontend extracts a pure, framework-free `applyReplacement(doc, excerpt, replacement)` util and adds **vitest** (pure only — no jsdom/testing-library; this is the repo's first JS test tooling: package.json script + config) with tests for match / no-match / first-of-multiple / multi-line excerpt / empty replacement. CodeMirror `view.dispatch` wiring and panel states are manual-verify.

**8. Scope.** One task, no milestone. Phase A backend (schema + instructions + prop + PHPUnit), Phase B frontend (Package-3 refactor + `applyReplacement` util + vitest + panel "Rewrite"/Apply/"Applied ✓" UI + dispatch/select/scroll).

## Residual risk

Prompt reliability: the model must reproduce `excerpt` closely enough to match the buffer verbatim. Mitigated by optional/localized replacements + disable-on-no-match; expect some notes to be advice-only in practice. Instruction tuning is part of Phase A.

## Relevant files

Backend: `app/Ai/Agents/BlogPostReviewer.php` (schema + instructions), `app/Services/PostReviewService.php`, `app/Jobs/ReviewPost.php`, `app/Http/Controllers/Admin/PostController.php` (edit prop), `tests/Feature/Admin/ReviewPostJobTest.php`, `tests/Feature/Admin/PostReviewTest.php`.
Frontend: `resources/js/components/admin/markdown-editor.tsx`, `resources/js/components/admin/post-review-panel.tsx`, `resources/js/components/admin/post-form.tsx`, `resources/js/hooks/use-post-review.ts`, `resources/js/types/admin.ts`, new pure util (e.g. `resources/js/lib/apply-replacement.ts`) + vitest config.

## Preserved constraints (from JOEY-18 / 18.2)

Edit-page only; body markdown only; safe logging (no prompts/notes/bodies); AI fakes only in automated tests; existing review clean/stale/loading/failed/superseded/retry UX untouched. `replacement` is additive and optional — the `review` prop contract only gains a field.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A review note that includes a replacement renders a 'Rewrite' block showing the replacement as literal (non-rendered) monospace text, with an Apply button beneath it
- [x] #2 A note without a replacement renders as advice-only (Why + Try) with no Rewrite block and no Apply button
- [x] #3 Clicking Apply replaces the first exact occurrence of the note's excerpt in the live editor buffer with its replacement, via a CodeMirror transaction (not a page reload or server content write)
- [x] #4 After applying, the newly written text is selected and scrolled into view in the editor, and the note shows an affirmative 'Applied' state distinct from the 'passage changed' state
- [x] #5 Native CodeMirror undo reverts an applied change
- [x] #6 When a note's excerpt is not present in the live editor buffer, its Apply button is disabled with a 'passage has changed / re-review' message
- [x] #7 Applied state is client-only (server latest_review is never mutated) and resets when a new review result lands
- [x] #8 The BlogPostReviewer schema includes an optional replacement field and instructions direct the agent to provide it only for precise, localized drop-in rewrites and omit it for structural notes
- [x] #9 PHPUnit proves a replacement returned by a faked reviewer persists into latest_review and is exposed in the PostController::edit review.notes prop
- [x] #10 The excerpt-find/replace logic is a pure framework-free function covered by vitest for match, no-match, first-of-multiple, multi-line excerpt, and empty replacement cases
- [x] #11 Legacy persisted notes without a replacement key render as advice-only without error
- [x] #12 All existing project gates pass: pint, rector, phpstan/larastan, pnpm types:check/lint:check/fmt:check, existing PostReviewTest + ReviewPostJobTest, and the production Vite build
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented per the locked design in two phases; all gates green.

**Phase A (backend):** `BlogPostReviewer` gained an optional `replacement` schema field (not `->required()`) plus instruction tuning directing the agent to emit it only for precise, localized drop-in rewrites and omit it for structural notes. `PostReviewService` carries `replacement` through the note mapping verbatim when the agent supplies a filled string (structural/legacy notes stay advice-only); return-type docblocks updated. `PostController::edit` needed no change — `latest_review` is raw JSON so `review.notes` surfaces `replacement` automatically. Tests: `ReviewPostJobTest` proves a faked reviewer's `replacement` persists into `latest_review`; `PostReviewTest` proves it surfaces in the edit `review.notes` prop.

**Phase B (frontend):** New pure `lib/apply-replacement.ts` (exact substring, first occurrence, returns `{from,to,doc}` or null) with vitest coverage for match / no-match / first-of-multiple / multi-line / empty-replacement — the repo's first JS test runner (added `test` script + `vitest.config.ts` + `vitest` devDependency). Package-3 refactor: `MarkdownEditor` now takes typed `review?: PostReviewPanelProps` and renders `PostReviewPanel` itself, owning `applyReviewReplacement` which dispatches one CodeMirror transaction, selects the new range, and scrolls it into view (native undo reverts). `PostReviewPanel` renders a Rewrite block (literal monospace), Apply → Applied ✓, and a disabled "passage has changed — re-review" state when the excerpt isn't in the live buffer. Applied state is client-only and reset by remounting via a `key` on the review identity (`dispatchedAt|reviewedAt`) — the lint-clean alternative to a reset effect.

**Gates:** pint, rector, phpstan, full PHP suite (175 passed), vitest (5 passed), types:check, lint:check, fmt:check, production build — all pass. Only dependency added: vitest.
<!-- SECTION:FINAL_SUMMARY:END -->
