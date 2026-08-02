---
id: JOEY-5.7
title: Nocturne visual pass for admin post index
status: Done
assignee:
    - '@Joey McKenzie'
created_date: '2026-08-01 21:48'
updated_date: '2026-08-02 21:46'
labels:
    - frontend
    - admin
    - design
dependencies:
    - JOEY-5.5
    - JOEY-5.6
references:
    - docs/design/nocturne.md
    - resources/css/app.css
    - resources/js/pages/admin/posts/index.tsx
    - resources/js/components/admin/delete-post-dialog.tsx
    - resources/js/components/ui/table.tsx
    - resources/js/components/ui/badge.tsx
modified_files:
    - resources/js/pages/admin/posts/index.tsx
    - resources/js/components/admin/delete-post-dialog.tsx
    - resources/css/app.css
    - tests/Feature/Admin/PostIndexTest.php
parent_task_id: JOEY-5
priority: low
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->

Follow up on the Nocturne post editor and admin shell work by bringing the admin post index into the same visual system. Improve the information hierarchy, scanning experience, responsive behavior, status presentation, empty state, and row actions without changing post-management behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

<!-- AC:BEGIN -->

- [x] #1 The post index uses Nocturne typography, surfaces, borders, spacing, and accents consistently with the post editor and admin shell
- [x] #2 Post title, slug, status, tag, publication date, reading time, views, update time, and actions remain available and easy to scan
- [x] #3 Edit navigation, new-post navigation, empty-state action, and delete confirmation behavior remain accessible and functional
- [x] #4 The index has an intentional narrow-screen presentation without relying on unusable horizontal overflow
- [x] #5 Styling reuses existing Nocturne tokens and shared shadcn/Base UI components without new dependencies or backend changes
- [x] #6 Relevant frontend formatting, linting, type checking, and desktop/mobile visual checks pass

<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->

1. Rework `resources/js/pages/admin/posts/index.tsx` as a bounded Nocturne editorial catalog using the existing canvas, panel, hairline, prose, subtle, iris, Fraunces, Geist, and Geist Mono tokens. Keep a dense semantic table at `xl` and above, and use purpose-built editorial cards below `xl` so the sidebar-constrained content area never depends on horizontal scrolling.
2. Preserve every post datum and action in both presentations: title, slug, status, tag, publication date, reading time, views, update time, edit navigation, new-post navigation, and delete confirmation. Use the existing Badge, Button, Table, Link, and DeletePostDialog primitives, with status-specific Nocturne treatments, long-content wrapping/truncation, and clear focus/hover states.
3. Replace the generic empty panel with an intentional editorial empty state that explains the next action and keeps the first-post navigation prominent. Style `resources/js/components/admin/delete-post-dialog.tsx` as a bounded Nocturne overlay while preserving its Base UI anatomy, destructive semantics, form action, test hooks, behavior, and long-title resilience.
4. Strengthen the focused post-index feature test to lock the complete frontend data contract; retain existing backend behavior and make no controller, route, model, toast, dependency, or global shadcn token changes.
5. Run Prettier, targeted ESLint, TypeScript, Vite build, relevant PHPUnit post index/destroy tests, PHPStan, Rector, Pint, LSP/pi-lens diagnostics, independent review, and authenticated Playwright checks across desktop/mobile and light/dark states. Verify populated and empty layouts, navigation, delete cancellation, breakpoint switching, and synthetic maximum-length content without horizontal overflow.

<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->

Design direction: an editorial catalog rather than a generic dashboard table. The large-screen table remains because its columns support comparison and scanning; narrow screens become vertically composed manuscript cards with a compact metadata grid. Existing Nocturne palette is unchanged: canvas #f7f5ef/#0e1016, panel #ffffff/#171a23, hairline #e4e0d6/#262b38, prose #1b1d24/#e8e6df, subtle #5b6070/#8b90a0, and iris #4c5cc5/#9aa7ff. Fraunces carries the page and post titles, Geist the UI copy, and Geist Mono the path/status/data labels. The restrained signature is a catalog-like title rail and compact metadata rhythm; no extra motion beyond the existing first-light sweep.

Implemented the bounded Nocturne editorial catalog: shared editor header, compact five-column desktop table, full mobile manuscript cards, status-specific Badge treatments, preserved metadata/actions, directed empty state, and a locally scoped Nocturne delete dialog. Focused PHPUnit index/destroy tests pass (7 tests, 84 assertions); TypeScript and Prettier checks pass. Full ESLint is currently blocked by three pre-existing unused imports in `resources/js/components/app-sidebar.tsx` from unrelated preserved shell work; JOEY-5.7 files themselves have no LSP diagnostics.

Responsive review found two edge cases after the initial visual pass: the table appeared too early at the sidebar-constrained `lg` breakpoint, and valid unbroken 255-character titles/tags could force overflow. The implementation now keeps cards through `lg`, switches to the table at `xl`, truncates tags, wraps titles with `overflow-wrap:anywhere`, and applies the same wrapping resilience to the delete dialog. Browser probes confirmed no document or component overflow at 390px, 1024px, or 1280px, including synthetic maximum-length values.

Final verification: Prettier, targeted ESLint for both changed TSX files, TypeScript, Vite production build, PHPStan, Rector dry run, Pint, LSP/pi-lens diagnostics, and focused PHPUnit all pass. PHPUnit: 7 tests, 84 assertions. Authenticated Playwright checks passed for populated desktop/mobile in light/dark, empty mobile, new/edit/empty-state navigation, delete open/cancel, 1024px cards, 1280px table, and long-content overflow resilience. Full-project ESLint still reports three unchanged unused imports in `resources/js/components/app-sidebar.tsx`; JOEY-5.7 deliberately did not modify that unrelated completed shell file, and targeted relevant lint is green. Independent final review recommends PASS.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->

## Summary

- Recast the admin post index as a bounded Nocturne editorial catalog, reusing the editor header, namespaced palette, Fraunces/Geist/Geist Mono typography, hairlines, panel surfaces, and iris accents without changing global shadcn/Base UI tokens.
- Kept a compact semantic table for `xl` screens and added complete editorial cards below `xl`; both presentations retain title, slug, tag, status, publication date, update time, reading time, views, edit, and delete actions.
- Added status-specific Badge treatments, a directed first-post empty state, resilient wrapping/truncation for valid long content, and a locally scoped Nocturne delete dialog while preserving the existing Wayfinder/Inertia form behavior and test hooks.
- Strengthened `PostIndexTest` to verify the complete catalog prop contract. No controller, route, model, toast, package, lockfile, or dependency changes were made.

## Verification

- Prettier: pass
- Targeted ESLint on changed TSX files: pass
- TypeScript: pass
- Vite production build: pass (existing chunk-size advisory only)
- PHPStan, Rector dry run, and Pint: pass
- PHPUnit post index/destroy: 7 tests, 84 assertions, pass
- LSP and pi-lens diagnostics: clean
- Playwright: desktop/mobile, light/dark, populated/empty, new/edit/empty actions, delete open/cancel, `390px`/`1024px`/`1280px` overflow and breakpoint checks, plus synthetic maximum-length content: pass
- Independent final review: pass

## Baseline note

Full-project ESLint remains blocked by three unused imports in the unchanged `resources/js/components/app-sidebar.tsx`. They are outside JOEY-5.7's post-index-only scope; the changed frontend files pass ESLint cleanly.
<!-- SECTION:FINAL_SUMMARY:END -->
