---
id: JOEY-5.6
title: Nocturne visual pass for admin app shell
status: Done
assignee:
  - '@Joey McKenzie'
created_date: '2026-08-01 21:45'
updated_date: '2026-08-02 21:01'
labels:
  - frontend
  - admin
  - design
dependencies:
  - JOEY-5.5
references:
  - docs/design/nocturne.md
  - resources/css/app.css
  - resources/js/layouts/app-layout.tsx
  - resources/js/layouts/app/app-sidebar-layout.tsx
  - resources/js/components/app-shell.tsx
  - resources/js/components/app-content.tsx
  - resources/js/components/app-sidebar.tsx
  - resources/js/components/app-sidebar-header.tsx
  - resources/js/components/ui/sidebar.tsx
modified_files:
  - resources/css/app.css
  - resources/js/components/app-content.tsx
  - resources/js/components/app-logo.tsx
  - resources/js/components/app-shell.tsx
  - resources/js/components/app-sidebar-header.tsx
  - resources/js/components/app-sidebar.tsx
  - resources/js/components/breadcrumbs.tsx
  - resources/js/components/nav-footer.tsx
  - resources/js/components/nav-main.tsx
  - resources/js/components/nav-user.tsx
  - resources/js/components/ui/sidebar.tsx
  - resources/js/components/user-info.tsx
  - resources/js/components/user-menu-content.tsx
parent_task_id: JOEY-5
priority: low
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Follow-up to JOEY-5.5. Extend the Nocturne visual language from the post editor surface into the broader authenticated admin app shell: sidebar, header, breadcrumbs, page background, navigation states, and shared admin chrome. This should be a deliberate shell-level design pass, not a side effect of the post editor styling task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The authenticated admin shell uses Nocturne-compatible surfaces, typography, borders, and active states while preserving the existing sidebar layout and navigation behavior
- [x] #2 Breadcrumbs, sidebar navigation, user menu, and responsive/mobile sidebar behavior remain accessible and functional
- [x] #3 Existing admin pages continue to render correctly inside the updated shell, including the post index and post editor
- [x] #4 The styling reuses existing Nocturne and shadcn/Base UI tokens; no new dependencies or parallel theme system are introduced
- [x] #5 Relevant frontend formatting, linting, type checking, and visual viewport checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Establish a bounded Nocturne scope at the shared authenticated shell (`AppShell`/`AppContent`) using the existing canvas, panel, hairline, prose, subtle, iris, Geist, and Geist Mono tokens; do not remap global shadcn/Base UI tokens or introduce dependencies.
2. Theme the sidebar composition and shared chrome (`AppSidebar`, `AppLogo`, `NavMain`, `NavFooter`, `NavUser`) with panel/canvas surfaces, restrained mono labels, iris-backed active state, visible focus treatment, and a locally scoped user-menu portal treatment while preserving routes, prefetching, user actions, collapse state, tooltips, and dropdown positioning.
3. Theme the shell header and `Breadcrumbs` with Nocturne typography, hairline borders, canvas surfaces, subtle ancestor links, an iris hover/focus state, and a clear current-page treatment while preserving semantic breadcrumb markup and sidebar trigger behavior.
4. Forward the existing sidebar class to the mobile Sheet so the same bounded Nocturne adapter reaches both responsive variants, without changing the Sidebar API, state, keyboard shortcut, dimensions, or responsive behavior. Leave page-specific post-index markup (JOEY-5.7) and toast behavior (JOEY-5.4) untouched.
5. Validate the styling and unchanged rendering contracts with existing Laravel feature tests, frontend/PHP quality commands, production build, LSP diagnostics, and Playwright checks across desktop/mobile, expanded/collapsed, light/dark, user-menu, breadcrumb, tooltip, and post-index/editor states.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Implemented shell-local Nocturne adapters for sidebar and portal-based user-menu semantics. Tailwind v4 resolves inherited theme aliases at their declaration scope, so the bounded adapter intentionally sets both shadcn source variables and their local `--color-*` aliases; global tokens remain unchanged.
- Preserved sidebar state, cookie persistence, Ctrl/Cmd+B shortcut, route prefetching, current-section detection, tooltips, mobile Sheet anatomy, user-menu positioning, and breadcrumb semantics. Added `aria-current="location"` to the active primary navigation item.
- Forwarded `Sidebar`'s existing `className` to its mobile `SheetContent`, allowing the same bounded theme class on desktop and mobile without changing behavior or dimensions.
- Added `nativeButton` to the logout menu item because Inertia renders the POST Wayfinder link as a button; this removes a Base UI semantic warning while retaining logout behavior.
- Verification passed: project quality quick profile (Composer validation, PHPStan, ESLint); `pnpm run fmt:check`; `pnpm run lint:check`; `pnpm run types:check`; `pnpm run build`; `composer fmt:check`; `composer refactor:check`; and `php artisan test --compact tests/Feature/Admin/PostIndexTest.php tests/Feature/DashboardTest.php` (6 tests, 57 assertions). LSP reported zero diagnostics and pi-lens reported no issues in edited files.
- Playwright verified 1200×897 desktop and 390×844 mobile in light and dark appearance, expanded/collapsed sidebars, click and Ctrl+B toggling, collapsed tooltip, focus treatment, mobile dialog/Escape behavior, user-menu rendering and dismissal, current navigation/breadcrumb semantics, no document-level horizontal overflow, and rendering of both the existing post index and post editor. Shell/index checks had zero current console errors. The editor still reports pre-existing missing/mixed-content errors for assets embedded in the selected legacy post; those assets are unrelated to the shell change.
- Independent review found no product-code blockers and confirmed JOEY-5.7 post-index markup, JOEY-5.4 toast behavior, dependencies, and global theme tokens were untouched.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
## Summary
- Migrated the shared authenticated sidebar shell, page inset, header, breadcrumbs, logo, primary/footer navigation, and user menu to the existing Nocturne canvas/panel/hairline/prose/subtle/iris palette and Fraunces/Geist/Geist Mono typography.
- Kept the visual adapter bounded to the authenticated shell and portal-based user menu; no global shadcn/Base token rewrite, dependency, post-index redesign, or toast behavior change was introduced.
- Preserved sidebar structure and behavior across desktop and mobile, including collapse persistence, Ctrl/Cmd+B toggling, tooltips, route prefetching, mobile Sheet semantics, user-menu placement, and breadcrumb navigation. Added current-location semantics and corrected the logout item's Base UI native-button declaration.

## Verification
- `project_quality quick` — passed Composer validation, PHPStan, and ESLint.
- `pnpm run fmt:check`, `pnpm run lint:check`, `pnpm run types:check`, `pnpm run build` — passed.
- `composer fmt:check`, `composer refactor:check` — passed.
- `php artisan test --compact tests/Feature/Admin/PostIndexTest.php tests/Feature/DashboardTest.php` — 6 tests passed, 57 assertions.
- LSP and pi-lens diagnostics — no issues in edited files.
- Playwright — passed desktop/mobile, light/dark, expanded/collapsed, keyboard toggle, tooltip, focus, mobile Sheet, user menu, post index, and post editor checks. No shell regression or document-level horizontal overflow was observed.

## Scope
JOEY-5.7 remains To Do and unchanged. JOEY-5.4 remains In Progress and unchanged.
<!-- SECTION:FINAL_SUMMARY:END -->

Reviewed the JOEY-5.6 ticket, Nocturne design direction, ADR 0006, current authenticated shell/sidebar/header/navigation/breadcrumb implementation, Tailwind v4 dark-mode guidance, and existing shadcn/Base UI composition. The user explicitly requested execution of this bounded plan; JOEY-5.7 and JOEY-5.4 remain excluded.
<!-- SECTION:NOTES:END -->

<!-- SECTION:NOTES:END -->
