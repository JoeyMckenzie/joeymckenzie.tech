# Migrating this codebase from Tailwind + shadcn to StyleX

Read [`authoring.md`](authoring.md) alongside this file. This one covers the
translation and the order; that one is the API.

## What moves, and what stays

`components/ui/*` are shadcn components built on **Base UI** primitives
(`@base-ui/react`). Base UI supplies behaviour — focus management, ARIA, the
`useRender`/`mergeProps` render-prop plumbing. Tailwind supplies only the
paint. Only the paint moves. Keep every Base UI import, every `data-slot`, and
every prop signature you are not forced to change.

| Leaves                                              | Replaced by                                                    |
| --------------------------------------------------- | -------------------------------------------------------------- |
| Tailwind class strings                              | `stylex.create` + `stylex.props`                               |
| `cva()` variant maps                                | a `styles` object keyed by variant name                        |
| `cn()` / `clsx` / `tailwind-merge` (`lib/utils.ts`) | `stylex.props(a, b, cond && c)`                                |
| `className?: string` pass-through props             | `style?: StyleXStyles`                                         |
| CSS custom properties in `app/globals.css`          | `defineVars` in a `.stylex.ts` file                            |
| `.dark` class on `<html>`                           | `createTheme`                                                  |
| `@tailwindcss/typography` (`components/prose.tsx`)  | hand-written descendant styles — see [Hard cases](#hard-cases) |

## Order of operations

Each phase ends green: `npm run build && npm run lint && npm run types:check`
passes and the page still renders. Tailwind and StyleX coexist for the whole
middle of this migration, so a half-converted tree is the normal state, not a
broken one.

1. **Install alongside Tailwind.** Follow [`installation.md`](installation.md)
   with the repo deltas in [`../SKILL.md`](../SKILL.md). `@tailwindcss/postcss`
   stays in `postcss.config.mjs` next to `@stylexjs/postcss-plugin`. Verify
   with one throwaway `stylex.create` that actually paints.
   → done when a StyleX-styled element renders correctly in `npm run build`
   output with Tailwind still live.
2. **Tokens.** Port `:root` / `.dark` from `app/globals.css` into
   `app/tokens.stylex.ts`. See [Tokens](#tokens).
   → done when every custom property in `globals.css` has a `defineVars`
   counterpart and the dark theme is applied via `createTheme` in
   `app/layout.tsx`.
3. **Leaves first**, in this order: `separator`, `badge`, `input`, `textarea`,
   `card`, `empty`, `input-group`, `button`. A leaf has no children that read
   its classes, so converting it cannot break a parent.
4. **Composites**: `components/*.tsx` (`post-card`, `site-header`,
   `site-footer`, `page-header`, …), then `app/**/page.tsx`.
5. **`prose.tsx` last.** It is the only genuinely hard one; leaving it on
   Tailwind longest costs nothing.
6. **Teardown.** See [Teardown](#teardown).

## Tokens

`app/globals.css` carries two layers: the `@theme inline` block (Tailwind's
mapping from `--color-*` utility names to the raw properties) and the `:root` /
`.dark` blocks (the actual values). Only the second layer survives — the first
exists purely to generate Tailwind utilities.

```ts
// app/tokens.stylex.ts  — named exports only, nothing else in the file
import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
    background: "#0e0d0c",
    foreground: "#e9e6e1",
    // 8.93:1 on --background, 5.47:1 on --card. This is the whole colour
    // budget: links, active nav, focus rings, rules that read as interactive.
    primary: "#f0b46a",
    primaryForeground: "#0e0d0c",
    // ...
});

export const radius = stylex.defineVars({
    lg: "0.625rem",
    md: "calc(0.625rem * 0.8)",
    // ...
});
```

Three things to get right here:

- **Carry the comments across.** The palette comments in `globals.css` record
  measured WCAG ratios and the reasoning behind values that look arbitrary
  (`--muted-foreground` is deliberately not the brighter first pass;
  `--primary-foreground` is the canvas, not white, because white on amber is
  2.36:1). Those ratios cost real work to compute. Losing them loses the
  argument for the value.
- **`defineVars` only for what is themed.** Everything reachable from a future
  light theme (colours) is a var. Things that never change per-theme — the
  breakpoints, the tracking values, `--text-display`'s `clamp()` — belong in
  `defineConsts`, which compiles to literals with no custom-property
  indirection.
- **Dark is the only live theme today.** `app/layout.tsx` hardcodes
  `class="dark"` and the `:root` neutral palette is unreachable. Seed
  `defineVars` with the dark values as the defaults and skip `createTheme`
  entirely, or seed with `:root` and apply `createTheme` on `<html>`. Prefer
  the first: it does not invent a light palette nobody can see. A light theme
  later is one `createTheme` call.

The `@layer base` rules at the bottom of `globals.css` (`scrollbar-gutter`,
`::selection`, `font-variant-numeric` on `time`) are element-level defaults
with no component to hang them on. Keep them as plain CSS in `globals.css`
below the `@stylex` directive.

## Utility translation

Longhands, always — `padding: 16` not `padding: "16px 8px"`. Bare numbers are
pixels.

| Tailwind                             | StyleX                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `flex items-center gap-2`            | `display: "flex", alignItems: "center", gap: 8`                            |
| `px-2.5 h-8`                         | `paddingInline: 10, height: 32`                                            |
| `size-4`                             | `width: 16, height: 16`                                                    |
| `text-sm font-medium`                | `fontSize: "0.875rem", fontWeight: 500`                                    |
| `rounded-lg`                         | `borderRadius: radius.lg`                                                  |
| `bg-primary text-primary-foreground` | `backgroundColor: colors.primary, color: colors.primaryForeground`         |
| `border border-transparent`          | `borderWidth: 1, borderStyle: "solid", borderColor: "transparent"`         |
| `hover:bg-muted`                     | `backgroundColor: { default: null, ":hover": colors.muted }`               |
| `focus-visible:ring-3`               | `outlineWidth: { default: 0, ":focus-visible": 3 }` (see below)            |
| `md:flex-row`                        | `flexDirection: { default: "column", "@media (min-width: 768px)": "row" }` |
| `transition-all`                     | `transitionProperty: "all", transitionDuration: "150ms"`                   |

Two shapes to watch:

- **`border` is three longhands.** Tailwind's `border` sets width, style and
  colour at once. StyleX wants `borderWidth` / `borderStyle` / `borderColor`
  separately, and CSS defaults `border-style` to `none` — omit it and a
  1px border renders as nothing.
- **`ring-*` is not a border.** Tailwind's ring is a `box-shadow`. Either
  reproduce it as `boxShadow`, or switch to `outline` + `outlineOffset`, which
  is what the ring was emulating in the first place. Pick one and use it for
  every focus ring in the codebase.

## Hard cases

Four Tailwind patterns in this repo have no direct StyleX equivalent, because
StyleX only emits selectors it can see statically.

### 1. Opacity modifiers (`bg-primary/80`, `ring-ring/50`)

Tailwind synthesises a new colour per modifier. StyleX has no such syntax.
Three options, in order of preference:

1. Add the derived colour to `tokens.stylex.ts` as its own var
   (`primaryHover`). Best when the design actually has a named state colour —
   which is what `bg-primary/80` means on a button.
2. `color-mix(in oklch, ...)`, already used in `button.tsx`'s `secondary`
   variant. Fine inline: `backgroundColor: "color-mix(in oklch, " + colors.primary + " 80%, transparent)"`.
3. Separate the opacity onto its own property when the whole element fades
   (`opacity: 0.5` for the disabled state) rather than the colour.

### 2. Arbitrary descendant variants (`[&_svg]:size-4`, `[&_:not(pre)>code]:...`)

StyleX will not generate a selector that reaches into children. Invert it: the
child styles itself.

- `[&_svg:not([class*='size-'])]:size-4` in `button.tsx` — export an icon size
  from the button module and let icon call sites apply it, or give `Button` an
  explicit icon slot that applies the style to the icon element it renders.
- When the child genuinely must react to the _parent's state_ (not just exist
  inside it), that is what `stylex.when.ancestor()` plus a marker is for. It
  observes state; it does not style descendants by tag.

### 3. State variants on the same element (`aria-invalid:`, `aria-expanded:`, `disabled:`)

`:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within` and
`:disabled` nest as pseudo-classes and need nothing special. The ARIA ones are
different: the component already knows the state, because it is the prop it
was handed. Branch in JS rather than in CSS.

```tsx
<ButtonPrimitive
    {...stylex.props(
        styles.base,
        styles[variant],
        props["aria-invalid"] && styles.invalid
    )}
/>
```

This is the same instruction `authoring.md` gives about `:nth-child` — prefer a
JS change to a generated selector — applied to attribute state.

### 4. `@tailwindcss/typography` in `components/prose.tsx`

The plugin styles markdown output the component never renders itself, so
there is no element to attach a StyleX style to. There is no StyleX
equivalent, and the two workarounds are:

- **Style at the MDX boundary.** `mdx-components.tsx` maps every markdown
  element to a React component. Give each one its StyleX styles there and
  `Prose` becomes a plain container. This is the right end state — it is the
  only one where every rule is statically visible — but it is a real
  chunk of work: headings, links, lists, blockquotes, tables, `hr`, images,
  inline `code`, and `pre`.
- **Keep one hand-written CSS block** in `globals.css` scoped to `.prose`, and
  leave it as CSS. Honest, smaller, and keeps `prose.tsx`'s existing comments —
  including the one explaining why inline `code` needs `:not(pre) > code` and
  why the plugin's backtick `::before`/`::after` must be cleared.

Decide which before starting phase 5; do not start converting and find out.

## Worked example: `components/ui/button.tsx`

The `cva()` base string plus the `variant` and `size` maps become one
`stylex.create` call. Each `cva` variant key becomes a namespace; the lookup
that `cva` did is an index into `styles`.

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radius } from "@/app/tokens.stylex";

const styles = stylex.create({
    base: {
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "transparent",
        borderRadius: radius.lg,
        fontSize: "0.875rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        userSelect: "none",
        transitionProperty: "all",
        transitionDuration: "150ms",
        outlineWidth: { default: 0, ":focus-visible": 3 },
        outlineColor: colors.ring,
        outlineStyle: "solid",
        outlineOffset: 1,
        translate: { default: null, ":active": "0 1px" },
    },
    // variants
    default: {
        backgroundColor: {
            default: colors.primary,
            ":hover": colors.primaryHover,
        },
        color: colors.primaryForeground,
    },
    ghost: {
        backgroundColor: { default: null, ":hover": colors.muted },
        color: { default: null, ":hover": colors.foreground },
    },
    // sizes
    sizeDefault: { height: 32, gap: 6, paddingInline: 10 },
    sizeIcon: { width: 32, height: 32 },
    // states
    disabled: { pointerEvents: "none", opacity: 0.5 },
});

type Variant = "default" | "ghost" /* ... */;
type Size = "default" | "icon" /* ... */;

const sizes = { default: styles.sizeDefault, icon: styles.sizeIcon };

function Button({
    style,
    variant = "default",
    size = "default",
    ...props
}: ButtonPrimitive.Props & {
    variant?: Variant;
    size?: Size;
    style?: StyleXStyles;
}) {
    return (
        <ButtonPrimitive
            data-slot="button"
            {...props}
            {...stylex.props(
                styles.base,
                styles[variant],
                sizes[size],
                props.disabled && styles.disabled,
                style
            )}
        />
    );
}

export { Button };
```

Four things this shows:

- **`className` becomes `style: StyleXStyles`.** Every call site passing
  `className="..."` to a `ui/` component has to change with it — convert the
  component and its call sites in one commit, or the build breaks.
- **`stylex.props()` spreads last.** It returns `{ className, style }`; a
  `{...props}` after it would overwrite both. This is the failure mode behind
  "no `className` or `style` prop on an element with a `stylex.props()`
  spread" — the props spread is a `className` prop.
- **Caller styles go last inside `stylex.props()`**, so a caller can override.
- **A `stylex.props()` spread clobbers a `className` written beside it.** It
  returns `{ className, style }`, so `<div className="prose" {...stylex.props(x)}>`
  silently drops `prose` and the stylesheet keyed on it stops matching. When an
  element needs both a StyleX style and a hook for hand-written CSS, make the
  hook a data attribute (`data-prose`) -- a spread cannot collide with it.
- **A `style` prop must `Omit` the DOM one.** Base UI's prop types already
  carry `style?: CSSProperties`; intersecting a `StyleXStyles` on top produces
  a type `stylex.props()` will not accept. Write
  `Omit<ButtonPrimitive.Props, "style"> & { style?: StyleXStyles }`. Shadowing
  is the point -- an element with a `stylex.props()` spread must not receive a
  raw `style` at all.
- **`buttonVariants` cannot be exported.** `cva` returned a class string that
  other components composed. Anything importing `buttonVariants` or
  `badgeVariants` needs the style namespace instead — grep for both before
  converting.

### Base UI `useRender` components

`badge.tsx` and any component using `useRender` + `mergeProps` pass styling
through `mergeProps`, not JSX. Feed it the `stylex.props()` result:

```tsx
props: mergeProps<"span">(stylex.props(styles.base, styles[variant], style), props),
```

## Teardown

Only after the last Tailwind class is gone:

- **Replace the part of Preflight the site relies on first.** Removing Tailwind
  restores browser defaults, and it shows immediately: bullets down the nav,
  underlines under every link, `h1` back at browser sizes, `img` no longer
  `display: block` so the prose auto-margins stop centring. Write a short reset
  (box-sizing, zeroed margins, `font-size`/`font-weight: inherit` on headings,
  list and anchor resets, form controls inheriting font and colour) rather than
  a full normalize.
- **Carry `color-scheme: dark` off the `.dark` class.** It lived in the block
  shadcn generated; losing it hands the page light scrollbars and light form
  controls on a near-black canvas.
- Remove deps: `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`,
  `tw-animate-css`, `tailwind-merge`, `clsx`, `class-variance-authority`,
  `prettier-plugin-tailwindcss`, and `shadcn` if nothing else pulls it.
- Delete `lib/utils.ts` (`cn` and the `extendTailwindMerge` font-size
  workaround both exist only to serve Tailwind), and `components.json`.
- Strip `globals.css` to the `@stylex` directive plus the element-level base
  rules from phase 2.
- Drop `@tailwindcss/postcss` from `postcss.config.mjs` and flip
  `useCSSLayers` to `true` — with no foreign CSS left to outrank, layers are
  the better cascade behaviour.
- Remove `prettier-plugin-tailwindcss` from `prettier.config.js`.

`rg -n 'className|cva\(|cn\(|tailwind'` should come back empty except for the
`prose` block, if you kept one.
