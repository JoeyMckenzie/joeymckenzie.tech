import * as stylex from "@stylexjs/stylex";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";
import { reveal } from "@/components/reveal";

const styles = stylex.create({
    heading: {
        fontSize: text.display,
        lineHeight: text.displayLineHeight,
        letterSpacing: tracking.display,
        fontWeight: 600,
    },
    period: { color: colors.primary },
    updated: {
        display: "block",
        marginTop: 20,
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    intro: {
        marginTop: 24,
        maxWidth: "36rem",
        color: colors.mutedForeground,
        lineHeight: 1.625,
    },
});

export function PageHeader({
    heading,
    intro,
    updated,
    updatedLabel,
}: {
    heading: string;
    intro?: string;
    updated?: string;
    updatedLabel?: string;
}) {
    return (
        <header>
            <h1 {...stylex.props(styles.heading, reveal(0))}>
                {heading}
                <span {...stylex.props(styles.period)}>.</span>
            </h1>
            {updated && (
                <time
                    {...stylex.props(styles.updated, reveal(1))}
                    dateTime={updated}
                >
                    {updatedLabel}
                </time>
            )}
            {intro && <p {...stylex.props(styles.intro, reveal(2))}>{intro}</p>}
        </header>
    );
}
