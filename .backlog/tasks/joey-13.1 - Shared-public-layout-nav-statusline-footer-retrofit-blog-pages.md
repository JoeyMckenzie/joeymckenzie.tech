---
id: JOEY-13.1
title: 'Shared public layout: nav + statusline footer, retrofit blog pages'
status: To Do
assignee: []
created_date: '2026-07-30 18:32'
labels:
  - frontend
  - design
milestone: m-3
dependencies: []
parent_task_id: JOEY-13
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a single PublicLayout used by every public page so the site has consistent Nocturne chrome. Header: mono `jm.` logo + nav (home · blog · now · uses · cv) + light/dark toggle, with an active-link indicator. Footer: promote the Nocturne statusline into a site-wide mono footer — a Spotify now-playing slot on the left (widget delivered by JOEY-13.5; stub the slot so this task isn't blocked), and social links (GitHub/X/LinkedIn) + a `/style-guide` colophon link on the right, with the blinking cursor. Retrofit the already-shipped blog index (resources/js/pages/blog/index.tsx) and show (resources/js/pages/blog/show.tsx) to render inside this layout — they currently use a bare null layout with their own per-page statusline footer, which should give way to the shared footer. Old chrome reference: ../joeymckenzie.tech.old/main/resources/js/layouts/blog-layout.tsx.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A PublicLayout provides the header nav (home/blog/now/uses/cv) plus the light/dark toggle with an active-link indicator
- [ ] #2 The footer is a site-wide mono Nocturne statusline: a Spotify now-playing slot on the left, and social links + a /style-guide colophon link on the right
- [ ] #3 All public pages (home, now, uses, cv, error, blog index, blog show) render inside PublicLayout with consistent chrome and no separate bare footer on the blog pages
- [ ] #4 Responsive (usable mobile nav) and dark/light aware; prefers-reduced-motion respected
- [ ] #5 Frontend format, lint, and type checks pass
<!-- AC:END -->
