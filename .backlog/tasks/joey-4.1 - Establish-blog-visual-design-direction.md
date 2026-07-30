---
id: JOEY-4.1
title: Establish blog visual design direction
status: Done
assignee: []
created_date: '2026-07-29 23:15'
updated_date: '2026-07-30 06:20'
labels:
  - frontend
  - design
milestone: m-3
dependencies: []
modified_files:
  - vite.config.ts
  - resources/css/app.css
  - resources/js/app.tsx
  - routes/web.php
  - resources/js/types/blog.ts
  - resources/js/lib/mermaid-theme.ts
  - resources/js/components/blog/post-card.tsx
  - resources/js/pages/style-guide.tsx
  - docs/design/nocturne.md
parent_task_id: JOEY-4
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish the visual design direction for the redesigned public blog before building the pages, so the index and post pages share a coherent, intentional look (not a templated default and not a port of the old UI). Cover typography scale, color and theme including dark mode, layout and spacing system, and how rendered code blocks (Phiki/TokyoNight HTML) and Mermaid diagrams are styled. Use the frontend-design skill. Deliverable is the design direction plus reusable Tailwind v4 / Base UI primitives or tokens the page subtasks build on — not the full pages themselves.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A documented design direction (typography scale, color/theme including dark mode, layout/spacing, and code-block + Mermaid styling) is captured
- [x] #2 Reusable Tailwind/Base UI primitives or design tokens that the blog pages will consume are implemented
- [x] #3 The direction is applied to at least one representative element (e.g. a post card or the article body typography) as a reference
- [x] #4 Frontend lint and format checks pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Direction: **Nocturne (with a statusline)** — dark-first editorial, prose-led, one motion signature.

- Type: Fraunces (display + italic asides), Geist (body/UI), Geist Mono (code/chrome/metadata). Loaded via laravel-vite-plugin bunny() in vite.config.ts.
- Palette (namespaced, non-destructive — leaves global shadcn tokens alone): canvas/panel/hairline/prose/subtle/iris(accent)/ember. Light + dark keyed to existing .dark mechanism.
- Deliverables:
  1. docs/design/nocturne.md — captured direction (AC#1)
  2. resources/css/app.css — @theme tokens (fonts+colors), .prose-nocturne article styles, TokyoNight code-block plate, Mermaid container baseline (AC#1/#2)
  3. resources/js/lib/mermaid-theme.ts — reusable Mermaid theme config primitive for 4.3 (AC#2)
  4. resources/js/types/blog.ts — BlogPost shape 4.2/4.3 consume (AC#2)
  5. resources/js/components/blog/post-card.tsx — reference element (AC#3)
  6. reference/style-guide page + route to view & screenshot (AC#3/verify)
- Verify: pnpm fmt, lint:check, types:check, build all green (AC#4). Do NOT complete parent JOEY-4.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Direction chosen collaboratively: **Nocturne (with a statusline)** — dark-first editorial, prose-led, one motion signature; the terminal identity surfaces as a working statusline + ⌘K, not costume.

Type: Fraunces (display + italic asides), Geist (body/UI), Geist Mono (code/chrome) via bunny() in vite.config.ts (replaced unused Barlow families; global --font-sans left alone). Serif is reserved for display + asides so the reading body stays a crisp sans — keeps it out of the "high-contrast serif" AI cliché.

Tokens are namespaced (--canvas/panel/hairline/prose/subtle/iris/ember → bg-canvas/text-prose/text-iris/etc.) and DO NOT touch the existing shadcn/Base UI tokens the rest of the app uses; light/dark rides the existing .dark mechanism.

blog/ pages now resolve to a null layout in app.tsx (public surface, own chrome) — sets up 4.2/4.3.

Robustness fix caught in light-mode review: code plate is always the dark TokyoNight material, so its base foreground is fixed light (#c0caf5) and the language tag is fixed muted (#8b90a0) — un-highlighted fences stay readable in light mode; Phiki's inline colours still override.

Verified: pnpm fmt:check, lint:check, types:check, build all green; style guide screenshotted in dark + light via Playwright.

Post-review: Joey wants the style guide kept as a permanent, first-class site feature ("like my design? here it is"). Promoted from a throwaway blog reference to a public colophon at top-level route `/style-guide` (was `/blog/style-guide`); page moved to `resources/js/pages/style-guide.tsx`, copy reframed as an intentional colophon with a footer. app.tsx keeps the `blog/` null-layout case for 4.2/4.3 and adds a `style-guide` case. Re-verified fmt/lint/types/build; route registered.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Established the **Nocturne** visual design direction for the redesigned public blog and shipped the reusable foundation the page subtasks build on.

**Deliverables**
- `docs/design/nocturne.md` — documented direction: type, palette (light+dark), layout/spacing, code-block + Mermaid styling, signature/motion.
- `resources/css/app.css` — Tailwind v4 @theme tokens (fonts + Nocturne palette), `.prose-nocturne` article styles, TokyoNight code-block plate, Mermaid container, and `.nocturne-sweep`/`.nocturne-cursor` motion primitives (reduced-motion respected).
- `resources/js/types/blog.ts` — `BlogPost` shape + `formatViews` for 4.2/4.3.
- `resources/js/lib/mermaid-theme.ts` — `mermaidTheme(appearance)` config primitive for 4.3.
- `resources/js/components/blog/post-card.tsx` — reference element (framed cover desaturated→colour on hover, Fraunces title, mono meta).
- `resources/js/pages/blog/style-guide.tsx` + route `blog/style-guide` — living reference; `app.tsx` gives blog/ pages a null (public) layout.
- `vite.config.ts` — Fraunces / Geist / Geist Mono via bunny().

**Verification:** frontend format, lint, type-check, and production build all pass; rendered and screenshotted in dark + light modes.

Scope kept to the design system + one reference element — the index (JOEY-4.2) and post (JOEY-4.3) pages are intentionally not built, and parent JOEY-4 is left open.
<!-- SECTION:FINAL_SUMMARY:END -->
