---
id: JOEY-13.4
title: Error page (Nocturne)
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
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A Nocturne error page for 404/500/503 with the terminal motif: status code, a status-appropriate message (with a sensible fallback), and Home + Blog links. Wire it into Inertia v3's error rendering so production error responses render this page (see the Inertia error-handling approach — custom exception/error page for error pages). Old reference: ../joeymckenzie.tech.old/main/resources/js/Pages/error.tsx (had a terminal `app/error.tsx` label + big status code + Home/Browse-Blog actions).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Production error responses (404/500/503) render a Nocturne error page showing the status, a message, and Home + Blog links
- [x] #2 Uses Nocturne chrome (PublicLayout or a minimal standalone Nocturne frame); dark/light aware
- [x] #3 A feature test asserts an unknown route renders the error page component with a 404
- [x] #4 Frontend and backend checks pass
<!-- AC:END -->
