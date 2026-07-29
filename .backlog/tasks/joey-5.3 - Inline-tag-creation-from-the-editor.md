---
id: JOEY-5.3
title: Inline tag creation from the editor
status: To Do
assignee: []
created_date: '2026-07-29 23:16'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-5.1
  - JOEY-3
parent_task_id: JOEY-5
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Allow creating a new tag on the fly while authoring a post, so writing about a new topic doesn't require a code deploy (this was the agreed tags decision — seed the known nine, create the rest inline; deleting/renaming tags is out of scope). The post editor's tag control supports creating a tag by name that is immediately assignable to the post. Depends on admin CRUD (JOEY-5.1) and the Tag model (JOEY-3).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The post editor's tag control can create a new tag by name and assign it to the post in the same flow
- [ ] #2 New tag names are normalized (lowercase, unique); an existing name reuses the existing tag rather than duplicating
- [ ] #3 A feature test proves creating a post with a brand-new tag creates the tag and associates it
- [ ] #4 composer fmt/lint/refactor and frontend lint checks pass
<!-- AC:END -->
