import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
    background: "#0e0d0c",
    card: "#171614",
    popover: "#171614",
    secondary: "#1e1c1a",
    muted: "#171614",
    accent: "#1e1c1a",

    foreground: "#e9e6e1",
    cardForeground: "#e9e6e1",
    popoverForeground: "#e9e6e1",
    secondaryForeground: "#e9e6e1",
    accentForeground: "#e9e6e1",
    mutedForeground: "#7d766c",

    primary: "#f0b46a",
    primaryForeground: "#0e0d0c",
    ring: "#f0b46a",

    border: "#2e2a26",
    input: "#2e2a26",

    destructive: "#e5877a",
});

export const radius = stylex.defineConsts({
    md: "calc(0.625rem * 0.8)",
    lg: "0.625rem",
    xl: "calc(0.625rem * 1.4)",
    xl4: "calc(0.625rem * 2.6)",
});

export const text = stylex.defineConsts({
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

export const fonts = stylex.defineConsts({
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
});

export const breakpoints = stylex.defineConsts({
    sm: "@media (min-width: 40rem)",
    md: "@media (min-width: 48rem)",
    belowSm: "@media (max-width: 39.9375rem)",
});
