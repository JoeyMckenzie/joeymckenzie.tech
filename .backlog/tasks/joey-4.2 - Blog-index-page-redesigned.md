---
id: JOEY-4.2
title: Blog index page (redesigned)
status: To Do
assignee: []
created_date: '2026-07-29 23:15'
labels:
  - frontend
milestone: m-3
dependencies:
  - JOEY-8
  - JOEY-4.1
parent_task_id: JOEY-4
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the redesigned public blog index/listing page in React (Inertia), consuming the index endpoint from JOEY-8 and using the design direction and primitives from JOEY-4.1. Includes the post list/cards (cover, title, description, tag, formatted published date, reading time, view count), the tag filter, and a search input wired to the ?tag= / ?search query params (reflected in the URL). Responsive and dark-mode aware. This replaces the old blog/index page with a fresh design, not a port.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The index page renders published posts from the read endpoint showing cover, title, description, tag, formatted date, reading time, and view count
- [ ] #2 Tag filtering and title/description search work via query params and are reflected in the URL
- [ ] #3 Uses the design direction and primitives from the design-direction subtask; responsive and dark-mode aware
- [ ] #4 Frontend lint and format checks pass and the page renders against imported/seeded data
<!-- AC:END -->
