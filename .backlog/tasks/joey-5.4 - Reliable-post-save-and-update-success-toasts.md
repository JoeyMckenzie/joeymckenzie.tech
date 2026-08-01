---
id: JOEY-5.4
title: Reliable post save and update success toasts
status: In Progress
assignee:
  - Joey McKenzie
created_date: '2026-08-01 16:40'
labels:
  - frontend
  - backend
  - admin
dependencies:
  - JOEY-5.1
references:
  - resources/js/hooks/use-flash-toast.ts
  - resources/js/components/ui/sonner.tsx
  - app/Http/Controllers/Admin/PostController.php
parent_task_id: JOEY-5
priority: medium
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ensure the admin post authoring flow visibly confirms successful creates and updates. PostController already emits Inertia v3 `flash.toast` payloads, but the current client listener does not consistently display them after the redirect to the edit page. Fix the delivery path without duplicating notifications, while preserving the shared toast infrastructure used by settings and other admin actions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Successfully creating a post displays one success toast with the create confirmation message
- [ ] #2 Successfully updating a post displays one success toast with the update confirmation message
- [ ] #3 Feature tests assert the expected Inertia flash payloads for both create and update redirects
- [ ] #4 Relevant backend and frontend quality checks pass
<!-- AC:END -->
