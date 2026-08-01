---
id: JOEY-5.5
title: Nocturne visual pass for admin post editor
status: Done
assignee:
  - Joey McKenzie
created_date: '2026-08-01 21:40'
updated_date: '2026-08-01 22:42'
labels:
  - frontend
  - admin
  - design
dependencies:
  - JOEY-5.1
  - JOEY-5.2
  - JOEY-5.3
references:
  - docs/design/nocturne.md
  - docs/adr/0006-nocturne-expands-into-admin-by-bounded-surfaces.md
  - resources/css/app.css
  - resources/js/pages/style-guide.tsx
  - resources/js/pages/admin/posts/create.tsx
  - resources/js/pages/admin/posts/edit.tsx
  - resources/js/components/admin/post-form.tsx
  - resources/js/components/admin/markdown-editor.tsx
  - resources/js/components/ui/select.tsx
modified_files:
  - resources/css/app.css
  - resources/js/components/admin/markdown-editor.tsx
  - resources/js/components/admin/post-editor-header.tsx
  - resources/js/components/admin/post-form.tsx
  - resources/js/hooks/use-synchronized-scroll.ts
  - resources/js/pages/admin/posts/create.tsx
  - resources/js/pages/admin/posts/edit.tsx
parent_task_id: JOEY-5
priority: medium
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Iterate on the admin post create/edit experience so the editor feels like the private authoring surface behind the site's Nocturne public design system, rather than default scaffolded shadcn UI. Keep the existing authenticated admin shell, CRUD behavior, Markdown editor, image upload, validation states, responsive layout, and inline tag creation flow intact. Reuse Nocturne tokens and existing shared components; do not add dependencies or hard-code a parallel theme.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The create and edit post screens use Nocturne typography, spacing, surfaces, borders, and accents in the authoring area while preserving the existing admin sidebar/chrome
- [x] #2 The post form preserves current create/edit behavior, validation messaging, accessibility attributes, status selection, cover upload, Markdown content submission, and inline tag creation/reuse behavior
- [x] #3 The shared Base UI Select overlay behavior remains fixed: popup overlays following fields, matches trigger width, and shows the full tag list
- [x] #4 The Markdown editor toolbar, source pane, and server-rendered preview visually align with Nocturne while preserving image insertion, paste/drop interception, mobile Write/Preview toggle, and preview rendering behavior
- [x] #5 The approved create/edit visual matrix verifies desktop and mobile layouts, light and dark appearance, new-tag and scheduled states, mobile preview, and the open long-list Select
- [x] #6 Frontend formatting, linting, TypeScript type checking, and the production build pass
- [x] #7 The Markdown source and rendered preview panes synchronize scroll position bidirectionally by proportional document progress without feedback loops or regressions to editor behavior
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Approved after grilling on 2026-08-01. See ADR 0006.

## Direction: Nocturne authoring desk

Keep the shadcn/Base UI admin shell, but make post create/edit feel like the backstage drafting desk for the public Nocturne site. Adopt Nocturne as a bounded authoring surface rather than remapping global shadcn tokens.

1. Update `resources/js/pages/admin/posts/create.tsx` and `resources/js/pages/admin/posts/edit.tsx` with a Nocturne page header: mono path eyebrow, Fraunces `New post` / `Edit post` heading, one first-light sweep, and concise `text-subtle` supporting copy. On edit, keep views in the supporting copy and preserve the published-post `View live` action; do not repeat the current post title above its title field.
2. Use a wide outer authoring frame (approximately `max-w-6xl`). Keep Story and Publishing controls at a readable narrower measure (approximately `max-w-3xl`), while allowing the split source/preview workspace to use the full width.
3. Organize the existing field sequence into plain mono-labeled sections with hairline separators, not numbered terminal decoration or enclosing dashboard cards:
   - **Story:** title, slug, description, tag
   - **Content:** Markdown editor, cover
   - **Publishing:** status, scheduling, actions
4. Make the title the restrained editorial entry point with larger Fraunces text and a quiet hairline treatment. Keep labels, errors, field names, validation behavior, and all remaining controls conventional and accessible.
5. Apply existing Nocturne tokens (`canvas`, `panel`, `hairline`, `prose`, `subtle`, `iris`, and existing font utilities) at the bounded authoring composition layer. Preserve semantic destructive colors and `aria-invalid` behavior for errors; do not repurpose `ember` as an error color.
6. Preserve `resources/js/components/ui/select.tsx` portal/positioner/popup anatomy and behavior. Styling must not regress overlay stacking, trigger-width matching, available-height scrolling, or full-list display.
7. Restyle status choices as compact editorial state tiles with native radio semantics, Nocturne borders/subtle copy, and an iris selected state. Keep names, values, defaults, and change handling unchanged.
8. Restyle `resources/js/components/admin/markdown-editor.tsx` as a Nocturne writing surface. Make its toolbar a compact mono status strip and lightly theme CodeMirror's structural surface—background, foreground, caret, selection, gutters, and focus treatment—using existing Nocturne variables. Do not replace syntax highlighting or alter editor mechanics, hidden-textarea serialization, preview debounce, uploads, paste/drop capture, or the mobile Write/Preview toggle.
9. Keep an existing cover compact as a framed asset plate with replacement guidance; stack it naturally on mobile rather than turning it into a large hero.
10. Replace the bottom-only actions with a restrained sticky authoring bar inside the editor surface. Show only the controlled `DRAFT`, `PUBLISHED`, or `SCHEDULED` mono indicator plus Save and Cancel. Ensure it does not obscure content and remains below Select overlays.
11. Follow the existing appearance preference in both light and dark modes. Add no motion beyond the page-header first-light sweep and ordinary focus/hover transitions.
12. Visually verify this matrix:
    - create, desktop, dark
    - edit, desktop, light
    - create, mobile, light, with new-tag input revealed
    - edit, mobile, dark, with Markdown preview selected
    - separately inspect the open long-list Select and scheduled-status state
13. Run `pnpm run fmt:check`, `pnpm run lint:check`, `pnpm run types:check`, and `pnpm run build`. If formatting is needed, run `pnpm run fmt` and re-check.

## Scope boundaries

Only post create/edit is in scope. JOEY-5.6 owns the admin app shell and JOEY-5.7 owns the post index. No toast work from JOEY-5.4, backend changes, new dependencies, global shadcn theme rewrite, public-page changes, extra motion, or CRUD/form behavior changes.

## Approved follow-up: synchronized Markdown scrolling

Synchronize the CodeMirror source scroller and rendered preview scroller bidirectionally by proportional scroll progress. Use the existing CodeMirror `scrollDOM`, React refs, passive scroll behavior through React handlers, and a one-frame feedback guard so programmatic synchronization does not loop. Reapply the source position after refreshed preview HTML changes its scroll height. Preserve editor input, preview rendering, pane toggles, uploads, paste/drop, and mobile behavior. Verify source-to-preview and preview-to-source synchronization in the browser, then rerun frontend quality checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-08-01: Styling direction approved through a one-question-at-a-time grill. The task remains To Do for implementation in a fresh session. Follow-ups were split into JOEY-5.6 (admin app shell) and JOEY-5.7 (post index) to preserve the bounded-surface decision captured in ADR 0006.

2026-08-01: Implementation started from the approved plan. Scope remains limited to the post create/edit authoring surface; JOEY-5.4, JOEY-5.6, and JOEY-5.7 are explicitly excluded.

2026-08-01: Implemented the approved bounded Nocturne authoring desk. Added the shared editor header, Story/Content/Publishing composition, Fraunces title treatment, full-width source/preview workspace, compact cover plate, editorial status tiles, and sticky status/save/cancel bar. The admin shell, post index, toast behavior, backend, dependencies, and shared Select implementation were not changed.

2026-08-01: CodeMirror received scoped structural theming for panel/prose colors, caret, selection, gutters, placeholder, and focus while retaining the selected light/dark syntax theme and all editor mechanics. Added an accessible name to the CodeMirror textbox. Independent review found nested page-level main landmarks and the missing editor name; both were corrected before final validation.

2026-08-01: Visual verification completed in Chromium at 1200×900 for create/desktop/dark and edit/desktop/light, and at 390×844 for create/mobile/light with the new-tag input revealed and edit/mobile/dark with Preview selected. At 390×844, the open Select displayed all 10 existing tags plus the create option, matched the trigger width, and overlaid surrounding fields; the scheduled state showed its future datetime control and SCHEDULED action indicator. The sticky action bar was checked at the bottom of the mobile publishing flow.

2026-08-01: Final verification passed: pnpm run fmt:check; pnpm run lint:check; pnpm run types:check; pnpm run build; 45 focused admin post tests with 165 assertions across store, update, preview, and image upload; git diff --check; changed-file LSP/lens diagnostics. Browser verification produced no console errors; local object-storage images emitted pre-existing mixed-content warnings in the HTTPS dev environment.

2026-08-01: Follow-up polish requested after visual review: title-driven slug generation now remains active on both create and edit forms. Typing in the slug field still opts out and preserves an intentional custom slug.

2026-08-01: Reopened for the user-requested final editor UX polish: bidirectional proportional scroll synchronization between Markdown source and preview.

2026-08-01: Added a reusable synchronized-scroll hook with proportional progress mapping and a requestAnimationFrame feedback guard. CodeMirror scroll capture drives the preview; preview scrolling drives CodeMirror; refreshed preview HTML reapplies the current source position.

2026-08-01: Browser verification on the long edit fixture confirmed source→preview at exactly 50%/50% despite different scrollable heights (31,853px vs 37,329px), and preview→source at approximately 20.00%/20.00%. Frontend format, lint, TypeScript, build, 8 preview tests/30 assertions, LSP diagnostics, lens diagnostics, and git diff checks passed.

2026-08-01: Reopened for the requested final cleanup: remove the redundant server-rendered preview banner while preserving preview content and behavior.

2026-08-01: Removed the redundant preview status banner and its now-unused preview processing state. Browser verification confirmed the banner is absent and rendered Markdown remains visible. Frontend formatting, linting, TypeScript, LSP diagnostics, and git diff checks passed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Summary

Applied Nocturne to the bounded admin post create/edit authoring surface without changing the surrounding admin shell or post index. Create and edit now share a mono-path/Fraunces header with the single first-light sweep, and the form is organized into Story, Content, and Publishing sections with readable measures, hairline structure, a prominent editorial title field, compact cover treatment, Nocturne status tiles, and a restrained sticky action statusline.

The Markdown workspace now uses Nocturne toolbar, source, and preview surfaces. CodeMirror's structural chrome follows the active light/dark appearance while syntax highlighting and all source-editor mechanics remain intact. The editor textbox also has an explicit accessible name. The shared Base UI Select file was left untouched.

## Verification

- `pnpm run fmt:check`
- `pnpm run lint:check`
- `pnpm run types:check`
- `pnpm run build`
- `php artisan test --compact tests/Feature/Admin/PostStoreTest.php tests/Feature/Admin/PostUpdateTest.php tests/Feature/Admin/PostPreviewTest.php tests/Feature/Admin/PostImageUploadTest.php` — 45 tests, 165 assertions
- `git diff --check`
- Changed-file LSP and lens diagnostics
- Chromium visual matrix at 1200×900 and 390×844, including new-tag, mobile preview, open full-list Select, and scheduled states

## Scope

No backend, dependency, toast, admin-shell, post-index, public-page, or shared Select changes were made. Existing create/edit submission, validation, slug, tag, status, scheduling, cover, preview, upload, paste/drop, and mobile pane behaviors were preserved.

Follow-up: the slug now tracks title edits on both new and existing posts until the operator manually edits the slug.

Follow-up: Markdown source and rendered preview scrolling are now synchronized bidirectionally by proportional document progress, with a one-frame guard preventing feedback loops and preview refreshes retaining the source position.

Follow-up: removed the redundant “Preview — rendered by the server” banner so the rendered document begins directly at the top of the preview pane.
<!-- SECTION:FINAL_SUMMARY:END -->
