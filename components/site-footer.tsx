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
        // Flex rather than flowing text. JSX strips the whitespace between
        // adjacent elements, so as plain text this line had no break
        // opportunity except inside the author's name -- it either broke
        // between first and last name or, once the name was held together,
        // overflowed the viewport. As flex items each piece wraps as a unit.
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "lowercase",
    },
    // The line wraps on a narrow screen once there are a few links in it, and
    // without this it breaks between the first and last name.
    author: { whiteSpace: "nowrap" },
    // Each separator travels with the link after it, so a wrap never leaves a
    // stray slash at the end of a line.
    item: { whiteSpace: "nowrap" },
    // Amber, like the punctuation in the display headings -- the separators are
    // the only mark in the footer, so they are where the motif lands here.
    slash: { paddingInline: 4, color: colors.primary, opacity: 0.6 },
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
                    <span {...stylex.props(styles.author)}>
                        &copy; {new Date().getFullYear()} {site.author}
                    </span>
                    <span {...stylex.props(styles.item)}>
                        <span
                            {...stylex.props(styles.slash)}
                            aria-hidden="true"
                        >
                            /
                        </span>
                        <a href="/rss.xml" {...stylex.props(styles.link)}>
                            rss
                        </a>
                    </span>
                    <span {...stylex.props(styles.item)}>
                        <span
                            {...stylex.props(styles.slash)}
                            aria-hidden="true"
                        >
                            /
                        </span>
                        <Link href="/archive" {...stylex.props(styles.link)}>
                            archive
                        </Link>
                    </span>
                    <span {...stylex.props(styles.item)}>
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
