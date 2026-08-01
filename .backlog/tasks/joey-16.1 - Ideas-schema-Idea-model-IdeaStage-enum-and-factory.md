---
id: JOEY-16.1
title: 'Ideas schema, Idea model, IdeaStage enum, and factory'
status: To Do
assignee: []
created_date: '2026-08-01 00:04'
labels:
  - backend
  - admin
milestone: m-4
dependencies: []
references:
  - docs/adr/0005-ideas-board-stores-stage-derives-graduated-and-dismissed.md
parent_task_id: JOEY-16
priority: medium
ordinal: 16100
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The data layer for the Ideas board. One `ideas` table whose stored `stage` drives the Kanban lanes, with the two terminal outcomes left derived (post_id = Graduated, completed_at = Dismissed) per docs/adr/0005. Provides the model, enum, and factory the CRUD backend (JOEY-16.2) builds on.

Follow existing conventions: PostStatus-style backed enum (docs/adr/0005 explains why stage is the one stored status), Post-style model with attribute #[Fillable]/#[Appends], factory with named states. Regenerate ide-helper after adding the model.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Migration creates `ideas`: title (string), notes (text, nullable), stage (string, default 'spark'), ordinal (unsigned integer), completed_at (timestamp, nullable), post_id (nullable foreignId to posts with nullOnDelete), timestamps
- [ ] #2 `IdeaStage` string-backed enum with cases Spark (default), Developing, Ready, following the project enum conventions (PascalCase cases, blank line between cases)
- [ ] #3 `Idea` model: fillable columns, casts (stage to IdeaStage, completed_at to datetime), belongsTo(Post) relation, and derived-state helpers distinguishing open vs graduated (post_id set) vs dismissed (completed_at set)
- [ ] #4 `IdeaFactory` with named states for each stage plus graduated and dismissed
- [ ] #5 `php artisan ide-helper:models -RW` regenerated so the new model is annotated
- [ ] #6 Unit/model test proves the casts, the belongsTo(Post) relation, and the open/graduated/dismissed derivation
- [ ] #7 composer fmt / lint / refactor checks pass
<!-- AC:END -->
