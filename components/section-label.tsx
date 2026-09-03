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
    period: { color: colors.primary },
});

export function SectionLabel({
    children,
    action,
}: {
    children: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div {...stylex.props(styles.row)}>
            <h2 {...stylex.props(styles.label)}>
                {children}
                <span {...stylex.props(styles.period)}>.</span>
            </h2>
            <span {...stylex.props(styles.rule)} aria-hidden="true" />
            {action}
        </div>
    );
}
