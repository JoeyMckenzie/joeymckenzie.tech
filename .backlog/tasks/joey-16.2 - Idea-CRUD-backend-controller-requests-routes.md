---
id: JOEY-16.2
title: 'Idea CRUD backend: controller, requests, routes'
status: To Do
assignee: []
created_date: '2026-08-01 00:04'
labels:
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-16.1
references:
  - docs/adr/0005-ideas-board-stores-stage-derives-graduated-and-dismissed.md
parent_task_id: JOEY-16
priority: medium
ordinal: 16200
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The server-side CRUD for ideas, consumed by the Kanban frontend (JOEY-16.3). Depends on JOEY-16.1 for the `ideas` table, `Idea` model, and `IdeaStage` enum. Mirrors the existing Admin\\PostController conventions (resourceful, FormRequest validation, Inertia for pages, flash toasts). The drag-persist `move` endpoint is intentionally deferred to JOEY-16.3 where it is co-designed with the board.

Dismiss/restore toggle `completed_at` (recoverable graveyard); destroy is a hard delete for junk. Quick-add creates a card with title only, in the Spark stage, appended to the end of that lane's ordinal.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `Admin\IdeaController` with index (returns board data for the Inertia page), store (title required, defaults to Spark stage with appended ordinal), update (title/notes), dismiss and restore (set/clear completed_at), and destroy (hard delete)
- [ ] #2 `IdeaRequest` (or equivalent FormRequests) validating title required + notes nullable, following the PostRequest style
- [ ] #3 Routes registered inside the existing auth+verified group in routes/admin.php, named admin.ideas.*
- [ ] #4 Every endpoint is gated to auth + verified; guests and unverified users are rejected
- [ ] #5 Feature tests cover: store/update/destroy happy paths, validation failures (missing title), dismiss then restore toggling completed_at, and auth-gating on each route
- [ ] #6 composer fmt / lint / refactor checks pass
<!-- AC:END -->
