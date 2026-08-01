---
id: JOEY-16
title: Ideas board — blog-idea Kanban pipeline
status: To Do
assignee: []
created_date: '2026-08-01 00:03'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies: []
references:
  - docs/adr/0005-ideas-board-stores-stage-derives-graduated-and-dismissed.md
  - docs/adr/0004-admin-authors-markdown-with-server-rendered-preview.md
priority: medium
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Parent task. A personal, single-operator admin "Ideas" board: a Kanban of blog ideas that ripen through lanes (Spark → Developing → Ready) and graduate into real Post drafts. Auth-gated (auth + verified), reachable from a new "Ideas" sidebar item under Posts. Strictly separate from the .backlog/ engineering tasks and deliberately blog-ideas-only.

The spine is idea → draft graduation: a Ready-stage card's "→ Draft" action deep-links to posts/create?from_idea={id}, seeding title + content, and PostController@store writes idea.post_id back on save — reusing the existing authoring pipeline (JOEY-5.x) with zero new post-creation code. `ideas.stage` is the one stored status (a human ripeness judgment, not derivable); the terminal outcomes stay derived and are exits off the board — post_id set = Graduated, completed_at set = Dismissed — per docs/adr/0005. Notes are a plain textarea (raw capture that becomes post content in the create form), not the CodeMirror editor (docs/adr/0004). Drag/reorder and cross-lane moves use @dnd-kit with optimistic updates and rollback.

Subtasks break the epic into: schema + model, CRUD backend, the Kanban frontend + move endpoint, the graduation flow, and a Shipped/Dismissed views fast-follow.
<!-- SECTION:DESCRIPTION:END -->
