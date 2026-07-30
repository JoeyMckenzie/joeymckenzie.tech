---
id: JOEY-4.3
title: Blog post page with reactions and view count
status: Done
assignee: []
created_date: '2026-07-29 23:16'
updated_date: '2026-07-30 16:32'
labels:
  - frontend
milestone: m-3
dependencies:
  - JOEY-8
  - JOEY-9
  - JOEY-4.1
modified_files:
  - resources/js/pages/blog/show.tsx
  - resources/js/components/blog/reactions.tsx
  - resources/js/lib/mermaid-theme.ts
  - resources/css/app.css
  - database/seeders/PostSeeder.php
  - package.json
parent_task_id: JOEY-4
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the redesigned individual post page in React (Inertia), consuming the show endpoint from JOEY-8. Render the stored content_html (Phiki-highlighted code, and initialize Mermaid diagrams client-side via the mermaid JS library — same approach as the old site, which used mermaid ^11 as a frontend dependency). Show the cover, title, tag, published date, reading time, and view count, plus a reactions widget wired to the reactions API (JOEY-9). Uses the design direction from JOEY-4.1. Fresh design, not a port.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The post page renders the stored content_html with correct Phiki code highlighting and initializes Mermaid diagrams client-side
- [x] #2 The header shows cover, title, tag, published date, reading time, and view count
- [x] #3 The reactions widget shows per-type counts and the visitor's current reactions and toggles them via the reactions API
- [x] #4 Uses the design direction and primitives; responsive and dark-mode aware
- [x] #5 Frontend lint and format checks pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Groundwork done while finishing JOEY-8: `resources/js/pages/blog/show.tsx` exists and renders the article — back link, mono meta (date · tag · reading · views), Fraunces title + first-light sweep, optional cover, and the stored `content_html` inside `.prose-nocturne` (via dangerouslySetInnerHTML). Verified in dark mode against the show endpoint. Remaining for this task: (1) Mermaid client-side init using `mermaidTheme()` from `@/lib/mermaid-theme` — needs the `mermaid` npm dependency added (get approval first, old site used mermaid ^11); (2) the reactions widget wired to the JOEY-9 reactions API (per-type counts + visitor's current reactions + toggle). JOEY-9 is still To Do.

Visual scope complete (reactions deferred). show.tsx renders the article header (back link, mono meta, Fraunces title + sweep, cover) and the stored content_html in .prose-nocturne. Phiki code renders as the TokyoNight inset plate with language tag; verified with a hand-authored sample article seeded onto the nix post (PostSeeder::SAMPLE_ARTICLE_HTML).

Mermaid: added `mermaid@^11`, lazy-loaded via dynamic import only when a `.mermaid` block is present, initialised with `mermaidTheme(resolvedAppearance)` and re-run on light/dark toggle (original diagram source stashed so re-theming works). Mermaid's internal themeVariables didn't reliably drive node fill, so the SVG is re-skinned to the Nocturne palette via layered `!important` CSS in app.css (dark: canvas-fill nodes + iris borders; light: warm-white nodes + iris borders; mono labels, subtle arrows). Verified in both modes + build ships mermaid as a separate lazy chunk.

AC#1/#2/#4/#5 done. AC#3 (reactions widget) still open — needs JOEY-9 reactions API. Keeping this task In Progress until then.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Redesigned blog post page, complete.

- **Article** (`blog/show.tsx`): back link, mono meta, Fraunces title + first-light sweep, optional cover, and the stored `content_html` in Nocturne prose (TokyoNight code plate, italic-serif blockquotes, inline code).
- **Mermaid**: `mermaid@^11` lazy-loaded only when a `.mermaid` block is present, initialised via `mermaidTheme(resolvedAppearance)` and re-run on light/dark toggle; SVG re-skinned to the palette with layered `!important` CSS (dark nodes + iris borders in dark, warm-white + iris in light).
- **Reactions** (`components/blog/reactions.tsx`): four emoji reactions with per-type counts and the visitor's active reactions, optimistic toggle wired to the JOEY-9 API (CSRF via the XSRF-TOKEN cookie), reverting on failure/rate-limit.

Verified in-browser: code + a themed Mermaid diagram render in both modes; reactions load seeded counts (🔥5 👍5 🤯4 ❤️4), toggle 🔥5→6 (active) and back with DB reconciled to 18/fire=5. Responsive + dark/light aware. Frontend fmt/lint/types/build all pass; Mermaid ships as a separate lazy chunk.
<!-- SECTION:FINAL_SUMMARY:END -->
