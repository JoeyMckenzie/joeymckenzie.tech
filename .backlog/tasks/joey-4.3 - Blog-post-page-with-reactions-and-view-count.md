---
id: JOEY-4.3
title: Blog post page with reactions and view count
status: To Do
assignee: []
created_date: '2026-07-29 23:16'
labels:
  - frontend
milestone: m-3
dependencies:
  - JOEY-8
  - JOEY-9
  - JOEY-4.1
parent_task_id: JOEY-4
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the redesigned individual post page in React (Inertia), consuming the show endpoint from JOEY-8. Render the stored content_html (Phiki-highlighted code, and initialize Mermaid diagrams client-side via the mermaid JS library — same approach as the old site, which used mermaid ^11 as a frontend dependency). Show the cover, title, tag, published date, reading time, and view count, plus a reactions widget wired to the reactions API (JOEY-9). Uses the design direction from JOEY-4.1. Fresh design, not a port.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The post page renders the stored content_html with correct Phiki code highlighting and initializes Mermaid diagrams client-side
- [ ] #2 The header shows cover, title, tag, published date, reading time, and view count
- [ ] #3 The reactions widget shows per-type counts and the visitor's current reactions and toggles them via the reactions API
- [ ] #4 Uses the design direction and primitives; responsive and dark-mode aware
- [ ] #5 Frontend lint and format checks pass
<!-- AC:END -->
