---
id: JOEY-16.5
title: Shipped trophy lane and Dismissed view (fast-follow)
status: To Do
assignee: []
created_date: '2026-08-01 00:05'
labels:
  - frontend
  - backend
  - admin
milestone: m-4
dependencies:
  - JOEY-16.4
references:
  - docs/adr/0005-ideas-board-stores-stage-derives-graduated-and-dismissed.md
parent_task_id: JOEY-16
priority: low
ordinal: 16500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The payoff views for the two off-board terminal states, split out as a fast-follow so the core board (JOEY-16.3) and graduation (JOEY-16.4) can ship first. Depends on JOEY-16.4 for graduated ideas to exist. A read-only 'Shipped' lane makes the pipeline's output visible (which sparks became posts), and a Dismissed view keeps the recoverable graveyard reachable so a twice-dismissed idea can be resurrected.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A read-only 'Shipped' lane/section lists graduated ideas as cards linking to their posts
- [ ] #2 A Dismissed view lists dismissed ideas (completed_at set) with a restore action that returns them to the board
- [ ] #3 Feature tests cover graduated listing, dismissed listing, and restore
- [ ] #4 composer fmt / lint / refactor and frontend lint/type checks pass
<!-- AC:END -->
