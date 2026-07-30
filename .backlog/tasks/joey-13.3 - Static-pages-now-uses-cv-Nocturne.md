---
id: JOEY-13.3
title: 'Static pages: now, uses, cv (Nocturne)'
status: Done
assignee: []
created_date: '2026-07-30 18:33'
updated_date: '2026-07-30 19:53'
labels:
  - frontend
  - design
milestone: m-3
dependencies:
  - JOEY-13.1
parent_task_id: JOEY-13
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the now, uses, and cv pages into Nocturne. Content is a verbatim port of the old site's copy, kept hardcoded in the page components (these change rarely — no CMS). Each page: mono eyebrow + Fraunces title + first-light sweep, then sectioned content with a subtle one-shot scroll fade (no Framer Motion). Give `now` a fresh once-over during the port since it is a living-changelog page and most likely to read stale. Routes via Inertia inside PublicLayout. Old reference: ../joeymckenzie.tech.old/main/resources/js/Pages/{now,uses,cv}.tsx (now = Work/Online/Offline; uses = Stack/Software/Hardware/Tools; cv = experience/education/skills).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 /now, /uses, and /cv render the ported content in Nocturne styling inside PublicLayout
- [x] #2 Copy matches the old site (verbatim port), with `now` given a freshness pass
- [x] #3 Motion is Nocturne-restrained (sweep + subtle scroll fade), not Framer Motion; prefers-reduced-motion respected
- [x] #4 Responsive and dark/light aware
- [x] #5 Frontend format, lint, and type checks pass
<!-- AC:END -->
