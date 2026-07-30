# Nocturne — blog visual design direction

_Established in JOEY-4.1. Consumed by the blog index (JOEY-4.2) and post (JOEY-4.3) pages._

**Thesis:** a beautifully typeset essay read at night, with a craftsman's fingerprint at
the bottom of the screen. Dark-first, prose-led, disciplined — boldness spent in exactly
one motion moment. The reaction we're designing for is _"wow, this is clean."_

The audience is designers **and** developers: designers judge the type, grid, and
restraint; developers judge whether the code blocks and diagrams are pleasant to read.
Both juries have to be satisfied, which is why the whole system leans on precision rather
than ornament.

## Typography

| Role            | Face          | Usage                                                            |
| --------------- | ------------- | --------------------------------------------------------------- |
| Display         | **Fraunces**  | Post titles and headings. The one serif — carries personality.  |
| Asides / quotes | Fraunces _italic_ | Pull-quotes and blockquotes, where the voice gets personal. |
| Body / UI       | **Geist**     | Prose and all interface text.                                   |
| Code / chrome   | **Geist Mono**| Code blocks, metadata, tags, the statusline.                   |

Loaded via `laravel-vite-plugin` `bunny()` in `vite.config.ts`. Exposed as the Tailwind
utilities `font-display`, `font-body`, `font-mono` (tokens `--font-display` / `--font-body`
/ `--font-mono` in `app.css`).

Article prose is ~17px / 1.75 line-height on a ~640–720px measure. `h2` carries a hairline
underline; `h3`/`h4` step down without rules.

## Colour & theme

Dark is the canonical mode; light is a faithful inversion. Tokens are **namespaced** so
they never touch the existing shadcn/Base UI tokens the rest of the app uses.

| Token          | Utility         | Dark (primary) | Light     |
| -------------- | --------------- | -------------- | --------- |
| `--canvas`     | `bg-canvas`     | `#0e1016`      | `#f7f5ef` |
| `--panel`      | `bg-panel`      | `#171a23`      | `#ffffff` |
| `--hairline`   | `border-hairline` | `#262b38`    | `#e4e0d6` |
| `--prose`      | `text-prose`    | `#e8e6df`      | `#1b1d24` |
| `--subtle`     | `text-subtle`   | `#8b90a0`      | `#5b6070` |
| `--iris`       | `text-iris`     | `#9aa7ff`      | `#4c5cc5` |
| `--ember`      | `text-ember`    | `#e0b978`      | `#b4863b` |

`iris` is the single chromatic accent (links, markers, active state). `ember` is a warm
micro-accent used only in the load sweep and the blockquote rule. Light/dark switching
rides the existing `.dark` class and appearance cookie — no new mechanism.

## Layout & spacing

- Single centred column, generous vertical rhythm; the post is the artifact.
- **Index**: text-first post rows (`PostCard`) — framed cover, mono date · tag, Fraunces
  title, description, mono `reading · views` line.
- **Post**: mono `back` link, mono meta, large Fraunces title, the sweep, then pure reading.
- Covers are **meme images**, so they rest desaturated in a hairline frame and snap to full
  colour on hover (index) / full colour on the post page — memes read as curated plates,
  and the joke still lands on engagement.

## Code blocks (Phiki / TokyoNight)

TokyoNight is kept intact as a cool inset "plate" against the warm page — a deliberate
change of material. `.prose-nocturne pre` adds a hairline frame, a thin `iris` top-rule,
Geist Mono, and an uppercase language tag from `data-language` when Phiki exposes it.
Inline code is tinted toward `iris` and boxed in `panel`, distinct from block code.

## Mermaid diagrams

Rendered client-side in JOEY-4.3. `mermaidTheme(appearance)` in
`resources/js/lib/mermaid-theme.ts` returns a config (`theme: 'base'`) mapped to the
Nocturne palette: transparent background, `iris`/`ember` strokes, Geist Mono labels,
soft-rounded (`curve: 'basis'`) nodes. Diagrams land in the `.prose-nocturne .mermaid`
plate.

## Signature & motion

Near-silent by design — the scarcity _is_ the "clean".

1. **First light** — one `ember→iris` hairline (`.nocturne-sweep`) sweeps once on load
   beneath the title; later reused as the reading-progress glow. `prefers-reduced-motion`
   strips it to a static rule.
2. **Statusline** — a persistent Geist Mono bar (`NORMAL · path · tag · reading% · ↑views ▮`)
   with a blinking block cursor (`.nocturne-cursor`). The craftsman fingerprint.
3. **⌘K command palette** styled as vim's `:` line for tag/search (wired in JOEY-4.2).
4. Link underlines grow on hover; mode toggle crossfades. Nothing else moves.

## What ships in this task

- `vite.config.ts` — Fraunces / Geist / Geist Mono via `bunny()`.
- `resources/css/app.css` — `@theme` font + colour tokens, `.prose-nocturne`, code-block
  plate, Mermaid container, `.nocturne-sweep` / `.nocturne-cursor` motion primitives.
- `resources/js/types/blog.ts` — `BlogPost` shape + `formatViews`.
- `resources/js/lib/mermaid-theme.ts` — `mermaidTheme()` primitive.
- `resources/js/components/blog/post-card.tsx` — the reference element.
- `resources/js/pages/style-guide.tsx` (route `/style-guide`) — a standing public
  colophon that renders the whole system on one screen; kept live as a personality detail.

## Reviewer's note (why this isn't a templated default)

The one risk was drifting into the "high-contrast serif" AI cliché. Kept out of that lane
by going **deep indigo, not cream**, pairing the serif with Geist Mono and an iris accent
instead of terracotta, and reserving the serif for _display + asides_ so the reading body
stays a crisp sans. The terminal identity shows as a working statusline, not costume.
