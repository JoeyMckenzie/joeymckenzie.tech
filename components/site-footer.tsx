import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/site";

const styles = stylex.create({
    footer: {
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
    },
    inner: {
        marginInline: "auto",
        display: "flex",
        width: "100%",
        maxWidth: "48rem",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingInline: 16,
        paddingBlock: 40,
    },
    line: {
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    // Amber, like the punctuation in the display headings -- the separators are
    // the only mark in the footer, so they are where the motif lands here.
    slash: { paddingInline: 8, color: colors.primary, opacity: 0.6 },
    link: {
        color: { default: "inherit", ":hover": colors.primary },
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
});

export function SiteFooter() {
    return (
        <footer {...stylex.props(styles.footer)}>
            <div {...stylex.props(styles.inner)}>
                <p {...stylex.props(styles.line)}>
                    &copy; {new Date().getFullYear()} {site.author}
                    <span {...stylex.props(styles.slash)} aria-hidden="true">
                        /
                    </span>
                    <a href="/rss.xml" {...stylex.props(styles.link)}>
                        rss
                    </a>
                    <span {...stylex.props(styles.slash)} aria-hidden="true">
                        /
                    </span>
                    <Link href="/archive" {...stylex.props(styles.link)}>
                        archive
                    </Link>
                </p>
                <SocialLinks size={16} />
            </div>
        </footer>
    );
}
