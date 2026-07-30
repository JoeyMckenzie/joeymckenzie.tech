---
id: JOEY-13.1
title: 'Shared public layout: nav + statusline footer, retrofit blog pages'
status: Done
assignee: []
created_date: '2026-07-30 18:32'
updated_date: '2026-07-30 18:53'
labels:
  - frontend
  - design
milestone: m-3
dependencies: []
modified_files:
  - resources/js/layouts/public-layout.tsx
  - resources/js/components/social-links.tsx
  - resources/js/components/spotify-now-playing.tsx
  - resources/js/app.tsx
  - resources/js/pages/blog/index.tsx
  - resources/js/pages/blog/show.tsx
  - resources/js/pages/style-guide.tsx
parent_task_id: JOEY-13
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a single PublicLayout used by every public page so the site has consistent Nocturne chrome. Header: mono `jm.` logo + nav (home · blog · now · uses · cv) + light/dark toggle, with an active-link indicator. Footer: promote the Nocturne statusline into a site-wide mono footer — a Spotify now-playing slot on the left (widget delivered by JOEY-13.5; stub the slot so this task isn't blocked), and social links (GitHub/X/LinkedIn) + a `/style-guide` colophon link on the right, with the blinking cursor. Retrofit the already-shipped blog index (resources/js/pages/blog/index.tsx) and show (resources/js/pages/blog/show.tsx) to render inside this layout — they currently use a bare null layout with their own per-page statusline footer, which should give way to the shared footer. Old chrome reference: ../joeymckenzie.tech.old/main/resources/js/layouts/blog-layout.tsx.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A PublicLayout provides the header nav (home/blog/now/uses/cv) plus the light/dark toggle with an active-link indicator
- [x] #2 The footer is a site-wide mono Nocturne statusline: a Spotify now-playing slot on the left, and social links + a /style-guide colophon link on the right
- [x] #3 All public pages (home, now, uses, cv, error, blog index, blog show) render inside PublicLayout with consistent chrome and no separate bare footer on the blog pages
- [x] #4 Responsive (usable mobile nav) and dark/light aware; prefers-reduced-motion respected
- [x] #5 Frontend format, lint, and type checks pass
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Shared Nocturne chrome for the public site.

`PublicLayout` (resources/js/layouts/public-layout.tsx): header with the `jm.` mono logo + nav (home · blog · now · uses · cv) with a CSS active-underline (no Framer Motion, prefix-match for blog) + a light/dark toggle (useAppearance); a site-wide mono statusline footer — Spotify now-playing slot on the left, `SocialLinks` (GitHub/X/LinkedIn) + a `/style-guide` colophon link + blinking cursor on the right. Ported `SocialLinks` from the old site; added a `SpotifyNowPlaying` stub for the footer slot (JOEY-13.5 fills in the real fetch/poll).

Wired via the app.tsx layout resolver: `blog/*` and the named public pages (home, now, uses, cv, error, style-guide) resolve to PublicLayout. Retrofitted the existing public pages (blog index, blog show, style-guide) to drop their own bg wrapper + per-page footer and live inside the shared chrome.

Verified in-browser: header nav renders with the active state (blog → iris underline), the statusline footer shows, the blog index shows all 32 imported posts with real cover images, the post page inherits the chrome and its inline images load, and the header is usable at 390px. home/now/uses/cv/error don't exist yet (JOEY-13.2/13.3/13.4) but are already routed to PublicLayout and will inherit the chrome when built. Frontend format/lint/type checks and the production build all pass.
<!-- SECTION:FINAL_SUMMARY:END -->
