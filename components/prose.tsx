import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, fonts, radius } from "@/app/tokens.stylex";

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
