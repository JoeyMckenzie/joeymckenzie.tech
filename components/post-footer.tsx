import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import {
    breakpoints,
    colors,
    fonts,
    text,
    tracking,
} from "@/app/tokens.stylex";
import type { Post } from "@/lib/posts";
import { site } from "@/lib/site";

const styles = stylex.create({
    footer: {
        marginTop: 80,
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
        paddingTop: 32,
    },
    neighbors: {
        display: "grid",
        gap: 24,
        gridTemplateColumns: {
            default: "1fr",
            [breakpoints.sm]: "1fr 1fr",
        },
    },
    // Column 2 explicitly, so the newest post stays on the right even when
    // there is no older one to fill the cell beside it.
    newer: {
        gridColumn: { default: "auto", [breakpoints.sm]: 2 },
        textAlign: { default: "start", [breakpoints.sm]: "end" },
    },
    neighbor: { display: "block", textDecoration: "none" },
    direction: {
        color: {
            default: colors.mutedForeground,
            [stylex.when.ancestor(":hover")]: colors.primary,
        },
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
    neighborTitle: {
        display: "block",
        marginTop: 10,
        color: {
            default: colors.foreground,
            [stylex.when.ancestor(":hover")]: colors.primary,
        },
        transitionProperty: "color",
        transitionDuration: "200ms",
        fontSize: "0.9375rem",
        fontWeight: 500,
        lineHeight: 1.45,
        letterSpacing: "-0.01em",
        textWrap: "balance",
    },
    source: {
        marginTop: 40,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    sourceLink: {
        color: { default: "inherit", ":hover": colors.primary },
        textDecoration: "none",
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
});

export function PostFooter({
    slug,
    older,
    newer,
}: {
    slug: string;
    older?: Post;
    newer?: Post;
}) {
    return (
        <footer {...stylex.props(styles.footer)}>
            <nav {...stylex.props(styles.neighbors)} aria-label="More posts">
                {older && (
                    <Link
                        href={`/blog/${older.slug}`}
                        {...stylex.props(
                            styles.neighbor,
                            stylex.defaultMarker()
                        )}
                    >
                        <span {...stylex.props(styles.direction)}>
                            &larr; older
                        </span>
                        <span {...stylex.props(styles.neighborTitle)}>
                            {older.title}
                        </span>
                    </Link>
                )}
                {newer && (
                    <Link
                        href={`/blog/${newer.slug}`}
                        {...stylex.props(
                            styles.neighbor,
                            styles.newer,
                            stylex.defaultMarker()
                        )}
                    >
                        <span {...stylex.props(styles.direction)}>
                            newer &rarr;
                        </span>
                        <span {...stylex.props(styles.neighborTitle)}>
                            {newer.title}
                        </span>
                    </Link>
                )}
            </nav>

            <p {...stylex.props(styles.source)}>
                <a
                    href={`${site.repo}/blob/${site.branch}/content/blog/${slug}.md`}
                    {...stylex.props(styles.sourceLink)}
                >
                    view source
                </a>
            </p>
        </footer>
    );
}
