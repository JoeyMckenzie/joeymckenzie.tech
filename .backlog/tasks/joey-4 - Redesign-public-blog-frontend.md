---
id: JOEY-4
title: Redesign public blog frontend
status: Done
assignee: []
created_date: '2026-07-29 23:12'
updated_date: '2026-07-30 16:32'
labels:
  - frontend
  - design
milestone: m-3
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Parent task. Deliver a fresh visual design for the public blog — the index/listing page and the individual post page — rather than porting the old Radix-based UI (the site has since migrated to Base UI). This is a design-led track; subtasks cover establishing the visual direction and building each page against the read-side endpoints from the Public Site milestone. Use the frontend-design skill for the direction work. Reactions UI and view-count display live on the post page.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Public blog frontend redesigned on the **Nocturne** design system (dark-first editorial, Fraunces + Geist + Geist Mono, single motion signature). All three subtasks delivered:

- **JOEY-4.1** — design direction + reusable Tailwind v4 tokens, article prose, TokyoNight code plate, Mermaid theme primitive, PostCard, and a public `/style-guide` colophon.
- **JOEY-4.2** — blog index at `/blog`: search + tag filters reflected in the URL, PostCards, empty state, statusline footer.
- **JOEY-4.3** — post page: stored content_html in Nocturne prose, lazy themed Mermaid, and the anonymous reactions widget.

Backend read/reactions endpoints (JOEY-8, JOEY-9) were built alongside to serve the frontend. Whole suite 63/63 (289 assertions); pint/phpstan/rector/prettier/eslint/tsc/build all green. Verified in-browser in light + dark and at mobile width.

Not in this track (future work): the one-time markdown import that backfills real `content_html` for all posts (seeded content is factory-generated except one representative sample), and real R2 cover images (covers currently fall back to the gradient plate).
<!-- SECTION:FINAL_SUMMARY:END -->
