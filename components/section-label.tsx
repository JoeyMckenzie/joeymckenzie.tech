import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";

const styles = stylex.create({
    row: { display: "flex", alignItems: "center", gap: 16 },
    label: {
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
    },
    rule: { flex: "1", height: 1, backgroundColor: colors.border },
});

// The mono section marker used on every page that has sections. The rule is
// part of the label rather than a separate element above it: in a design built
// out of hairlines, one line that carries the heading reads as structure, where
// a line plus a heading reads as two unrelated things.
export function SectionLabel({
    children,
    action,
}: {
    children: ReactNode;
    /** Optional trailing link, e.g. "all posts →". */
    action?: ReactNode;
}) {
    return (
        <div {...stylex.props(styles.row)}>
            <h2 {...stylex.props(styles.label)}>{children}</h2>
            <span {...stylex.props(styles.rule)} aria-hidden="true" />
            {action}
        </div>
    );
}
