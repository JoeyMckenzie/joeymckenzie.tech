---
id: JOEY-5.7
title: Nocturne visual pass for admin post index
status: To Do
assignee:
  - Joey McKenzie
created_date: '2026-08-01 21:48'
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
- [ ] #1 The post index uses Nocturne typography, surfaces, borders, spacing, and accents consistently with the post editor and admin shell
- [ ] #2 Post title, slug, status, tag, publication date, reading time, views, update time, and actions remain available and easy to scan
- [ ] #3 Edit navigation, new-post navigation, empty-state action, and delete confirmation behavior remain accessible and functional
- [ ] #4 The index has an intentional narrow-screen presentation without relying on unusable horizontal overflow
- [ ] #5 Styling reuses existing Nocturne tokens and shared shadcn/Base UI components without new dependencies or backend changes
- [ ] #6 Relevant frontend formatting, linting, type checking, and desktop/mobile visual checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Deferred until JOEY-5.5 establishes the Nocturne authoring surface and JOEY-5.6 establishes the surrounding admin shell. Decide during planning whether the desktop table should remain a table or become a denser editorial list, while ensuring the mobile presentation remains semantically and operationally complete.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
<!-- SECTION:NOTES:END -->
