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

The reduced-motion block exempts `[data-scroll-driven]`. Everything else in it
is time-based and should stop; a scroll-driven animation is positioned by the
reader's own scrolling, and collapsing its duration would pin it at its end
frame rather than hold it still. `components/reading-progress.tsx` is the only
thing carrying that attribute.

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

Heading anchors are appended by `rehype-autolink-headings` off the `id`
`rehype-slug` writes. The `#` is wrapped in an `aria-hidden` span and the label
lives on the link, so the anchor stays keyboard-reachable without a screen
reader announcing "number sign" on every heading in the post.

`[data-prose] pre` carries a deliberately lopsided `2.25rem 1rem 1rem`. The top
padding is the strip `components/code-block.tsx` floats its language label and
copy button over — the two are a pair, and changing one without the other either
overlaps the first line of code or leaves a gap above it.

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

## Icons and manifest

All of these are file conventions, so nothing in `layout.tsx` references them —
`metadata` deliberately has no `icons` key. Next reads each file's real
dimensions and writes the `sizes` attribute itself, which is why the names look
arbitrary:

| File             | From (favicon.io)      | Emits                              |
| ---------------- | ---------------------- | ---------------------------------- |
| `favicon.ico`    | `favicon.ico`          | `rel="icon"`, 16/32/48 in one file |
| `icon0.png`      | `favicon-16x16.png`    | `rel="icon" sizes="16x16"`         |
| `icon1.png`      | `favicon-32x32.png`    | `rel="icon" sizes="32x32"`         |
| `apple-icon.png` | `apple-touch-icon.png` | `rel="apple-touch-icon"` 180x180   |
| `manifest.ts`    | (rewritten, see below) | `rel="manifest"`                   |

The numbered `icon0` / `icon1` names are not cosmetic: multiple icons are only
possible by suffixing, and the files sort lexically. Next content-hashes each
one into its `href`, so a replaced icon is a new URL.

The two `android-chrome-*.png` sizes live in `public/` instead, because only the
manifest points at them and it does so by absolute path. They are never
`<link>`ed.

`manifest.ts` is hand-written rather than favicon.io's `site.webmanifest`, which
ships empty `name` / `short_name` and `#ffffff` for both theme colours — an
Android status bar flashing white above this page. Writing it as a route also
lets the name and description come from `lib/site.ts` rather than being a third
copy of them.

`public/favicon.svg` was deleted with this change. It was Astro's own logo,
left over from the migration, and nothing had linked it since.

The artwork is Twemoji `1f30c` (milky way), **CC-BY 4.0, which requires
attribution** — the licence and source are in the `about.txt` that came with the
generated set.

## SEO

Three things here are less obvious than they look.

**Metadata merges per top-level key, not deeply.** A page that sets
`alternates.canonical` replaces the layout's entire `alternates` object and
takes the RSS autodiscovery `<link>` with it; a page that sets `openGraph`
replaces that object and loses `siteName` and `locale`. The first is why every
route builds its alternates through `lib/metadata.ts` instead of by hand, and
the second is why the post route repeats `siteName` and `locale` in its own
`openGraph`. Both were caught by diffing the built `<head>`, not by reading.

**There is no canonical in the root layout, on purpose.** Because metadata
merges down, one there would declare `/` the canonical URL of every page that
did not override it — actively worse than having none. Each route sets its own,
with the trailing slash `trailingSlash: true` makes canonical.

**The markdown twins carry `X-Robots-Tag: noindex`, not a robots.txt
`Disallow`.** Each is a byte-for-byte duplicate of an indexed post. A disallowed
URL is never fetched, so a crawler would never see a noindex on it, and Google
can still index a blocked URL it finds linked — the header is the instruction
that actually removes them. The rule is in `public/_headers`.

`structured-data.tsx` emits JSON-LD: `Person` + `WebSite` on the home page,
`BlogPosting` + `BreadcrumbList` on each post. The nodes carry `@id`s and
reference each other, so a post names its author by id rather than inlining a
second copy of the Person. It is server-rendered, so it costs no client
JavaScript.

The sitemap normalises trailing slashes. `nav` stores `/blog`, the site serves
`/blog/`, and a sitemap listing the pre-redirect URL points crawlers at a 308.

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

`archive/page.tsx` is the dense counterpart to `blog/page.tsx`: no search, no
tags, no thumbnails, every post on one screen grouped by year. Its rows set
`prefetch={false}` — all 33 are in the viewport at once, and Next would
otherwise pull every post payload and every hero image for a page that renders
no images at all. It is linked from the footer rather than the nav; a sixth nav
item overflows the header on a 390px screen.

`colophon/page.tsx` is the public version of these notes. It borrows the
name/description grid from `uses` for its stack list and the `Prose` sections
from `now` for the narrative. The prose is written to match the voice in
`content/blog`, which meant em dashes and "rather than" in particular: the
posts use one em dash across all 33 of them, so a page with eight read as
written by something else. `color`, never `colour` — the posts are unanimous.

`blog/[slug]/index.md/route.ts` serves each post's markdown source verbatim.
Only a whole segment can be dynamic, so `/blog/<slug>.md` is not expressible and
the extension lives one level down as a literal segment — the same trick
`rss.xml` uses. Its `Content-Type` header only applies under `next dev`: a
static export writes the body to disk and discards the response, so in
production the type comes from Cloudflare's MIME table via the file extension.
`llms.txt/route.ts` indexes those files.

The "View as Markdown" button in the post header is what makes that route
discoverable, and it is the reason `public/_headers` types those files as
`text/plain`: at `text/markdown` a browser downloads the file instead of showing
it, which is the wrong outcome for a button whose label promises a view. It
reuses `Button` with caller-supplied mono styling rather than gaining a variant,
and renders as an `<a>` through Base UI's `render` prop.
