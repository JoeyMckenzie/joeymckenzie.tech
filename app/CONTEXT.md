# app/

Routes, the root layout, the design tokens, and the one hand-written stylesheet.
Build and tooling notes are in the root `CONTEXT.md`.

## Palette (`tokens.stylex.ts`)

Warm near-black canvas, one amber accent. Ratios below are measured WCAG
contrast, computed rather than eyeballed, and they are the argument for values
that otherwise look arbitrary.

| Token                        | Value     | Contrast                               |
| ---------------------------- | --------- | -------------------------------------- |
| `background`                 | `#0e0d0c` | canvas                                 |
| `card` / `muted` / `popover` | `#171614` | raised one step                        |
| `secondary` / `accent`       | `#1e1c1a` | hover wash                             |
| `foreground`                 | `#e9e6e1` | 18.51:1 on background, 11.34:1 on card |
| `mutedForeground`            | `#7d766c` | 8.72:1 on background, 5.34:1 on card   |
| `primary` / `ring`           | `#f0b46a` | 8.93:1 on background, 5.47:1 on card   |
| `primaryForeground`          | `#0e0d0c` | 8.93:1 on primary                      |
| `border` / `input`           | `#2e2a26` | 3.06:1 on background                   |

`mutedForeground` is deliberately not the 11.19:1 first pass — muted text that
bright competes with the body copy instead of sitting under it. `border` clears
the 3:1 threshold for a UI boundary, which matters more here than usual: the
design uses rules instead of cards, so hairlines are load-bearing structure.
`primaryForeground` is the canvas rather than white because white on amber is
2.36:1 and fails outright.

`colors` is `defineVars` because it is the one group a theme would override. The
site is dark-only today, so the dark palette is seeded as the default and there
is no `createTheme` call anywhere. A light theme is one `createTheme` against
this group. The stock neutral `:root` palette shadcn shipped is not ported —
nobody has ever seen it render and inventing one would be unverifiable guesswork.

Everything else (`radius`, `text`, `tracking`, `fonts`, `breakpoints`) is
`defineConsts`: no theme overrides them, so they compile to literals with no
custom-property indirection.

Geist Sans does display work, Geist Mono does instrumentation. The two `tracking`
values are the whole idea — display type pulled tight so the counters close up at
size, mono labels opened right out so they read as machine annotation rather than
small prose. `text.display` is fluid rather than a breakpoint step because at a
fixed `3.375rem` the hero broke across four lines on a 390px screen.

`fonts` reference the custom properties next/font generates at build time and
writes onto `<html>` in `layout.tsx`. The names are declared there, so they are
stable to reference.

`breakpoints` are only the two steps the design uses, matching Tailwind's `sm:`
and `md:` so converted components keep the breakpoints they were built against.
`belowSm` is Tailwind's `max-sm:`, written as a max-width rather than negating
`sm` so it reads the way it is used.

## Layout

Dark-only for now, matching the astro site's default. The theme toggle it shipped
is not ported yet.

`<html>` keeps a `className` rather than a `stylex.props()` spread: it carries
nothing but the two font-variable class names next/font generates, and nothing
but a class can carry those. The element's own styling, `color-scheme` included,
lives with the other element defaults in `globals.css`.

`--selection-bg` / `--selection-fg` are set on `<body>` in StyleX and read by a
bare `::selection` rule in `globals.css`. `::selection` has no component to live
on — it applies to text everywhere — and custom properties inherit, so one bare
rule reaches the whole page while the colours still come from `tokens.stylex.ts`.

The `<ViewTransition update="page">` wrapper is what makes route changes animate
at all: React only calls the browser API when a `<ViewTransition>` is in the tree
during a navigation. It wraps the content rather than living in each `page.tsx`
because the animation wanted is an update crossfade on a container that persists,
not an enter/exit pair. The `page` class it assigns is styled in `globals.css`.

## globals.css

Three sections: reset, element defaults, motion, prose.

**Reset.** Tailwind's Preflight used to do this. Removing Tailwind put browser
defaults back and it showed immediately — bullets down the nav, underlines under
every link, `h1` at browser sizes. Only the part the site depends on, not a full
normalize. Headings are reset to `inherit` because left at browser defaults they
fight every `fontSize` StyleX sets.

**Element defaults.** The handful of rules with no element in a component to hang
a `stylex.props()` spread on. Values that need the palette arrive as custom
properties set in StyleX, so this file never hard-codes a colour.

- `color-scheme: dark` was carried by the `.dark` class shadcn put on `<html>`.
  That class went with the rest of Tailwind; losing this would hand the page
  light scrollbars and light form controls on a near-black canvas.
- `scrollbar-gutter: stable` because short routes (`/now`, `/uses`) have no
  scrollbar and long ones (`/blog`, `/cv`) do, so the centred column jumped 7px
  sideways on every navigation between the two. Measured: nav left edge was 256px
  without a scrollbar, 249px with one.
- `font-variant-numeric: tabular-nums` on `time` — Geist ships proper tabular
  figures, and dates and reading times sit in columns down the post list.

**Motion.** Two layers, split by what each tool is good at:

1. Entrances are compiled CSS keyframes in `components/reveal.tsx`.
2. Route changes are React `<ViewTransition>` (browser-native, no JS payload).
   Layout changes on the blog filter are Motion — reached for the one thing
   neither CSS nor view transitions can do.

`::view-transition` gets `pointer-events: none` because the overlay otherwise
swallows clicks for its whole duration. Old content leaves fast so it stops
competing for attention; new content arrives slower and waits out the exit.

The header is the spatial anchor: if it slid with the content there would be no
fixed reference point telling the reader the page changed rather than the whole
viewport, so its group is pinned and the old snapshot hidden (which also avoids a
flash of two headers). The active-nav underline is named separately, which lifts
it out of the pinned group so the browser slides it from the old nav item to the
new one while the header stays still.

The post thumbnail → hero morph blurs mid-flight to hide pixel interpolation
between two very different image sizes.

**Prose.** Post bodies. Everything else on the site is styled in StyleX; this is
markdown output, so there is no element in `components/prose.tsx` to attach a
style to and no way for StyleX to generate a descendant selector. The values are
not duplicated here — `Prose` sets each `--prose-*` property from
`tokens.stylex.ts`, so this file only decides which element gets which one.
**Change a colour there, not here.**

Headings take more air above than below: the space belongs to the section they
open, not the paragraph they sit on. Code blocks run at `0.875em` because Geist
Mono reads a size larger than Geist Sans at the same nominal size, so a block left
at the body's `1rem` looks bigger than the prose around it rather than level with
it — the same value the inline chips use, which keeps inline and block code
agreeing. The font family is set on `:is(pre, code)` rather than `code` alone
because a block that ever arrived without a wrapping `code` would fall through to
the browser's default monospace.

## Routes

`not-found.tsx` renders to `out/404.html`; see the deploy notes in the root
`CONTEXT.md` for why that needs no routing config. Its `404` digits are not
`aria-hidden`: with no eyebrow above them they are the only thing on the page
that says 404, so they have to be readable. Each digit reveals on its own beat —
the one bit of showing off on the site.

`page.tsx` and `blog/page.tsx` draw their post-list hairlines on the row rather
than with a `divide-y`-style `& > * + *` rule, which StyleX will not generate. On
the home page the first row skips it because `SectionLabel` has already drawn a
hairline directly above.

The post route's dynamic `import()` is turned by Turbopack into a context module
over `content/blog/*.md`, so every post compiles at build time.

`cv/page.tsx` uses a left rule as its structure, same as the hairlines elsewhere.
