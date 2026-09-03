import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, fonts, radius } from "@/app/tokens.stylex";

// The one place the site still hands styling to a stylesheet, and the reason is
// structural: this component renders markdown it never writes the elements for,
// so there is no element here to hang a `stylex.props()` spread on. StyleX
// generates no descendant selectors, by design.
//
// The split is deliberate rather than a retreat. StyleX still owns every
// *value* -- the block below sets the palette as custom properties from the
// same `tokens.stylex.ts` the rest of the site reads, so there is one source of
// truth for the colours. `app/globals.css` owns only the descendant selectors
// (`.prose h2`, `.prose :not(pre) > code`) that CSS alone can express.
//
// This replaced `@tailwindcss/typography`, whose entire colour set had to be
// re-pointed at the palette anyway: its `prose-invert` ramp is cool gray, and
// body copy came out #d1d5dc against a warm #0e0d0c canvas, reading as a
// different design from the rest of the page.
const styles = stylex.create({
    prose: {
        "--prose-body": colors.foreground,
        "--prose-headings": "#fff",
        "--prose-muted": colors.mutedForeground,
        "--prose-links": colors.primary,
        "--prose-rule": colors.border,
        "--prose-code-bg": colors.secondary,
        "--prose-mono": fonts.mono,
        "--prose-radius": radius.lg,
    },
});

export function Prose({ children }: { children: ReactNode }) {
    return (
        <div data-prose {...stylex.props(styles.prose)}>
            {children}
        </div>
    );
}
