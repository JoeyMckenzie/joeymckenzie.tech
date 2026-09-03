import * as stylex from "@stylexjs/stylex";

/* --- the palette ------------------------------------------------------
   Warm near-black canvas, one amber accent. Every value carries its measured
   WCAG ratio against the surface it is actually painted on -- the ratios are
   computed, not eyeballed, and they are the argument for values that
   otherwise look arbitrary.

   `defineVars` rather than `defineConsts` because these are the one group
   that a theme would override. The site is dark-only today (`<html>` carries
   `dark` in `app/layout.tsx`), so the dark palette is seeded here as the
   default and there is no `createTheme` call anywhere. A light theme is one
   `createTheme` against this group; the stock neutral `:root` palette that
   shadcn shipped is not ported, because nobody has ever seen it render and
   inventing one would be unverifiable guesswork. */
export const colors = stylex.defineVars({
    /* --- surfaces --- */
    background: "#0e0d0c", // canvas
    card: "#171614", // raised one step off the canvas
    popover: "#171614",
    secondary: "#1e1c1a",
    muted: "#171614",
    accent: "#1e1c1a", // hover wash on ghost buttons

    /* --- ink (ratio vs background) --- */
    foreground: "#e9e6e1", // 18.51:1
    cardForeground: "#e9e6e1", // 11.34:1 on card
    popoverForeground: "#e9e6e1",
    secondaryForeground: "#e9e6e1",
    accentForeground: "#e9e6e1",
    // 8.72:1 on background, 5.34:1 on card. Deliberately not the 11.19:1
    // first pass -- muted text that bright competes with the body copy
    // instead of sitting under it.
    mutedForeground: "#7d766c",

    /* --- accent --- */
    // 8.93:1 on background, 5.47:1 on card. This is the whole colour budget:
    // links, active nav, focus rings, rules that need to read as interactive.
    // `primaryForeground` is the canvas, not white: white on amber is 2.36:1
    // and fails outright.
    primary: "#f0b46a",
    primaryForeground: "#0e0d0c", // 8.93:1
    ring: "#f0b46a",

    // 3.06:1 vs background -- clears the 3:1 threshold for a UI boundary,
    // which matters more here than usual: the design uses rules instead of
    // cards, so hairlines are load-bearing structure.
    border: "#2e2a26",
    input: "#2e2a26",

    destructive: "#e5877a",
});

/* Everything below is `defineConsts`, not `defineVars`: no theme overrides
   them, so they compile to literals with no custom-property indirection. */

export const radius = stylex.defineConsts({
    md: "calc(0.625rem * 0.8)",
    lg: "0.625rem",
    xl: "calc(0.625rem * 1.4)",
    xl4: "calc(0.625rem * 2.6)",
});

/* Geist Sans does display work, Geist Mono does instrumentation. The two
   tracking values are the whole idea: display type is pulled tight so the
   counters close up at size, and mono labels are opened right out so they
   read as machine annotation rather than small prose. */
export const text = stylex.defineConsts({
    // Fluid rather than a breakpoint step: at a fixed 3.375rem the hero broke
    // across four lines on a 390px screen.
    display: "clamp(2.375rem, 7.5vw, 3.375rem)",
    displayLineHeight: "1.02",
    title: "1.3125rem",
    titleLineHeight: "1.3",
    label: "0.6875rem",
    labelLineHeight: "1",
});

export const tracking = stylex.defineConsts({
    display: "-0.035em",
    label: "0.18em",
});

/* next/font generates the family names at build time and writes them onto
   `<html>` as these custom properties -- see `app/layout.tsx`. The variable
   names are the ones declared there, so they are stable to reference. */
export const fonts = stylex.defineConsts({
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
});

/* Only the two steps the design actually uses, matching Tailwind's `sm:` and
   `md:` so converted components keep the breakpoints they were built against. */
export const breakpoints = stylex.defineConsts({
    sm: "@media (min-width: 40rem)",
    md: "@media (min-width: 48rem)",
    // Tailwind's `max-sm:`. Written as a max-width rather than negating `sm`
    // so it reads the same way it is used.
    belowSm: "@media (max-width: 39.9375rem)",
});
