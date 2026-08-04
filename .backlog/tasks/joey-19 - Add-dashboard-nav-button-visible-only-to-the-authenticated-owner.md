---
id: JOEY-19
title: Add dashboard nav button visible only to the authenticated owner
status: To Do
assignee: []
created_date: '2026-08-04 05:53'
labels: []
dependencies: []
priority: low
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a button/link in the site navbar that navigates to `/dashboard`. It should only render for the authenticated user (me, the sole account), and stay hidden for anonymous visitors. This gives me a quick entry point into the dashboard without typing the URL.

Scope/details are intentionally light — we'll ideate on placement, styling, and the exact auth gate when we pick this up.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Navbar shows a button/link to /dashboard when the request is authenticated
- [ ] #2 The button is not rendered for unauthenticated (public) visitors
- [ ] #3 Placement and styling fit the existing navbar design
- [ ] #4 Behavior is covered by a test (authenticated sees it, guest does not)
<!-- AC:END -->
