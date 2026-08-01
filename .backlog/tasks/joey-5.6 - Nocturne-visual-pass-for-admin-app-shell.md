---
id: JOEY-5.6
title: Nocturne visual pass for admin app shell
status: To Do
assignee:
  - Joey McKenzie
created_date: '2026-08-01 21:45'
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
- [ ] #1 The authenticated admin shell uses Nocturne-compatible surfaces, typography, borders, and active states while preserving the existing sidebar layout and navigation behavior
- [ ] #2 Breadcrumbs, sidebar navigation, user menu, and responsive/mobile sidebar behavior remain accessible and functional
- [ ] #3 Existing admin pages continue to render correctly inside the updated shell, including the post index and post editor
- [ ] #4 The styling reuses existing Nocturne and shadcn/Base UI tokens; no new dependencies or parallel theme system are introduced
- [ ] #5 Relevant frontend formatting, linting, type checking, and visual viewport checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Deferred until after JOEY-5.5 lands and can act as the reference surface. Scope should include the shared app shell/sidebar/header components only, with page-specific redesigns tracked separately if needed.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
<!-- SECTION:NOTES:END -->
