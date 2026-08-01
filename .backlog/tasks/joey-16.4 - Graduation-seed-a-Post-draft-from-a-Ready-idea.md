---
id: JOEY-16.4
title: 'Graduation: seed a Post draft from a Ready idea'
status: To Do
assignee: []
created_date: '2026-08-01 00:05'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-16.3
references:
  - docs/adr/0005-ideas-board-stores-stage-derives-graduated-and-dismissed.md
  - docs/adr/0004-admin-authors-markdown-with-server-rendered-preview.md
parent_task_id: JOEY-16
priority: medium
ordinal: 16400
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The spine of the feature: turning a ripened idea into a real Post draft, reusing the existing authoring pipeline rather than fabricating a record (docs/adr/0005). Depends on JOEY-16.3 for the board and card Dialog that host the action. A valid Post requires tag_id, description, a non-nullable image, content, and a unique slug — an idea has none of that — so graduation is a deep-link into posts/create, not a background insert.

The Ready-stage card's Dialog exposes "→ Draft", linking to posts/create?from_idea={id}. PostController@create seeds title + content from the idea and carries the id through; PostController@store writes the created post's id back to idea.post_id, moving the idea off the board as Graduated. Because post_id is nullOnDelete, deleting that draft later returns the idea to the board at its prior stage — no orphaning.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Ready-stage cards expose a '→ Draft' action in their Dialog, linking to posts/create?from_idea={id}
- [ ] #2 PostController@create reads from_idea and seeds the create form's title + content from the idea, carrying the idea id through as a hidden field
- [ ] #3 PostController@store writes the new post's id to idea.post_id on successful create, so the idea leaves the board as Graduated
- [ ] #4 Deleting a graduated draft returns its idea to the board at its prior stage (nullOnDelete), verified by test
- [ ] #5 Feature tests cover: from_idea prefill present in the create page props, store links post_id, deleting the post reverts the idea, and graduation is offered only for Ready-stage ideas
- [ ] #6 composer fmt / lint / refactor and frontend lint/type checks pass
<!-- AC:END -->
