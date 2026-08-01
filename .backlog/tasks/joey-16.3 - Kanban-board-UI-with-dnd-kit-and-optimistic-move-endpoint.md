---
id: JOEY-16.3
title: Kanban board UI with @dnd-kit and optimistic move endpoint
status: To Do
assignee: []
created_date: '2026-08-01 00:04'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-16.2
references:
  - docs/adr/0005-ideas-board-stores-stage-derives-graduated-and-dismissed.md
parent_task_id: JOEY-16
priority: medium
ordinal: 16300
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The board itself: three lanes (Spark → Developing → Ready) of draggable cards, plus the endpoint that persists a drag. Depends on JOEY-16.2 for the CRUD endpoints and index data. Introduces @dnd-kit as the new frontend dependency (chosen over react-dnd because multi-container/cross-lane sorting is its headline use case).

Board state lives in a `use-idea-board` hook seeded from Inertia props — the component renders one settled board state and owns no transport, per the project react_rules. Drags apply optimistically and roll back on a failed persist. The move endpoint is a JSON invokable controller in the style of Admin\\PostImageController / PostPreviewController, not an Inertia visit, so a drop does not re-round-trip page props. Cards are compact draggable tiles; editing happens in a click-to-open Base UI Dialog to avoid drag/click ambiguity.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `pages/admin/ideas/index.tsx` renders three lanes (Spark/Developing/Ready) of the open ideas, ordered within each lane by ordinal
- [ ] #2 @dnd-kit/core + @dnd-kit/sortable added; cards reorder within a lane and move across lanes
- [ ] #3 A `use-idea-board` hook seeds board state from page props, applies moves optimistically, and rolls back with a toast when the persist fails — the component has no error branches
- [ ] #4 `Admin\IdeaMoveController` (invokable) handles PATCH admin/ideas/{idea}/move: persists the new stage and reindexes the affected lane(s) ordinals by id-array in a transaction; JSON response; gated to auth + verified
- [ ] #5 Cards are compact draggable tiles (title + one-line notes preview); clicking a card opens a Base UI Dialog to edit title/notes and to Dismiss or Delete
- [ ] #6 A quick-add input creates a new card in the Spark lane
- [ ] #7 An 'Ideas' nav item (Lightbulb icon) is added under Posts in the admin sidebar
- [ ] #8 Feature test covers the move endpoint (stage + ordinal reindex, auth-gating); pnpm types:check and lint:check pass
- [ ] #9 composer fmt / lint / refactor checks pass
<!-- AC:END -->
