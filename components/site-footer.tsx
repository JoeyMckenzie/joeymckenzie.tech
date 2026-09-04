import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import {
    breakpoints,
    colors,
    fonts,
    text,
    tracking,
} from "@/app/tokens.stylex";
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
    // Two units, the attribution and the link row, rather than one run of
    // peers. Left to wrap as peers the line strands a single link on a second
    // row behind an indented separator; stacking the two units puts the break
    // where the meaning already divides.
    line: {
        display: "flex",
        flexDirection: { default: "column", [breakpoints.sm]: "row" },
        alignItems: { default: "flex-start", [breakpoints.sm]: "center" },
        rowGap: 12,
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "lowercase",
    },
    // Amber, like the punctuation in the display headings -- the separators are
    // the only mark in the footer, so they are where the motif lands here.
    slash: { paddingInline: 4, color: colors.primary, opacity: 0.6 },
    // Joins the two units on one line, so it belongs to the wide layout only.
    joint: { display: { default: "none", [breakpoints.sm]: "inline" } },
    // Short enough at every width to stay on one line, which is what lets the
    // separators inside it be plain glyphs with nothing to guard against.
    links: { display: "flex", alignItems: "center", whiteSpace: "nowrap" },
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
                    <span>
                        &copy; {new Date().getFullYear()} {site.author}
                    </span>
                    <span
                        {...stylex.props(styles.slash, styles.joint)}
                        aria-hidden="true"
                    >
                        /
                    </span>
                    <span {...stylex.props(styles.links)}>
                        <a href="/rss.xml" {...stylex.props(styles.link)}>
                            rss
                        </a>
                        <span
                            {...stylex.props(styles.slash)}
                            aria-hidden="true"
                        >
                            /
                        </span>
                        <Link href="/archive" {...stylex.props(styles.link)}>
                            archive
                        </Link>
                        <span
                            {...stylex.props(styles.slash)}
                            aria-hidden="true"
                        >
                            /
                        </span>
                        <Link href="/colophon" {...stylex.props(styles.link)}>
                            colophon
                        </Link>
                    </span>
                </p>
                <SocialLinks size={16} />
            </div>
        </footer>
    );
}
