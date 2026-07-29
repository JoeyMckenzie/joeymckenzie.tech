---
id: JOEY-4.1
title: Establish blog visual design direction
status: To Do
assignee: []
created_date: '2026-07-29 23:15'
labels:
  - frontend
  - design
milestone: m-3
dependencies: []
parent_task_id: JOEY-4
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish the visual design direction for the redesigned public blog before building the pages, so the index and post pages share a coherent, intentional look (not a templated default and not a port of the old UI). Cover typography scale, color and theme including dark mode, layout and spacing system, and how rendered code blocks (Phiki/TokyoNight HTML) and Mermaid diagrams are styled. Use the frontend-design skill. Deliverable is the design direction plus reusable Tailwind v4 / Base UI primitives or tokens the page subtasks build on — not the full pages themselves.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A documented design direction (typography scale, color/theme including dark mode, layout/spacing, and code-block + Mermaid styling) is captured
- [ ] #2 Reusable Tailwind/Base UI primitives or design tokens that the blog pages will consume are implemented
- [ ] #3 The direction is applied to at least one representative element (e.g. a post card or the article body typography) as a reference
- [ ] #4 Frontend lint and format checks pass
<!-- AC:END -->
