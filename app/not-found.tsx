import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Link from "next/link";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";
import { Main } from "@/components/main";
import { reveal } from "@/components/reveal";

export const metadata: Metadata = {
    title: "Lost",
    description: "That page does not exist.",
};

const styles = stylex.create({
    main: { display: "flex", flexDirection: "column" },
    digits: {
        display: "flex",
        color: `color-mix(in oklab, ${colors.primary} 90%, transparent)`,
        fontFamily: fonts.mono,
        fontSize: "clamp(5rem, 26vw, 13rem)",
        lineHeight: 1,
        fontWeight: 500,
        letterSpacing: "-0.05em",
        userSelect: "none",
    },
    heading: {
        marginTop: 32,
        fontSize: text.display,
        lineHeight: text.displayLineHeight,
        letterSpacing: tracking.display,
        fontWeight: 600,
    },
    accent: { color: colors.primary },
    body: {
        marginTop: 24,
        maxWidth: "28rem",
        color: colors.mutedForeground,
        lineHeight: 1.625,
    },
    actions: {
        marginTop: 40,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 24,
    },
    action: {
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        transitionProperty: "color, text-decoration-color",
        transitionDuration: "200ms",
    },
    home: {
        color: colors.primary,
        textDecorationLine: "underline",
        textUnderlineOffset: 4,
        textDecorationColor: {
            default: `color-mix(in oklab, ${colors.primary} 40%, transparent)`,
            ":hover": colors.primary,
        },
    },
    read: {
        color: { default: colors.mutedForeground, ":hover": colors.foreground },
        textDecorationLine: "none",
    },
});

export default function NotFound() {
    return (
        <Main style={styles.main}>
            <p {...stylex.props(styles.digits)}>
                {["4", "0", "4"].map((digit, index) => (
                    <span key={index} {...stylex.props(reveal(index))}>
                        {digit}
                    </span>
                ))}
            </p>

            <h1 {...stylex.props(styles.heading, reveal(3))}>
                You must be lost
                <span {...stylex.props(styles.accent)}>.</span>
            </h1>

            <p {...stylex.props(styles.body, reveal(4))}>
                This one is on me. Either I moved it, or you have found a link I
                broke somewhere along the way. Happens more often than I would
                like to admit.
            </p>

            <div {...stylex.props(styles.actions, reveal(5))}>
                <Link href="/" {...stylex.props(styles.action, styles.home)}>
                    go home
                </Link>
                <Link
                    href="/blog"
                    {...stylex.props(styles.action, styles.read)}
                >
                    or read something instead
                </Link>
            </div>
        </Main>
    );
}
