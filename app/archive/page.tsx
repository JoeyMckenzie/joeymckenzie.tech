import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Link from "next/link";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";
import { FormattedDate } from "@/components/formatted-date";
import { Main } from "@/components/main";
import { PageHeader } from "@/components/page-header";
import { reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { getPosts, getPostsByYear } from "@/lib/posts";

const description = "Every post, newest first, one line each.";

export const metadata: Metadata = { title: "Archive", description };

const styles = stylex.create({
    years: { marginTop: 56 },
    // Spacing between year blocks comes from the index rather than
    // `:first-child` -- one less selector for the compiler to emit.
    yearSpaced: { marginTop: 56 },
    count: {
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
    },
    list: { marginTop: 4 },
    row: {
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        paddingBlock: 12,
        textDecoration: "none",
    },
    divided: {
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
    },
    date: {
        flexShrink: 0,
        width: "6.5rem",
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    title: {
        flex: "1",
        color: {
            default: colors.foreground,
            [stylex.when.ancestor(":hover")]: colors.primary,
        },
        fontSize: "0.9375rem",
        lineHeight: 1.45,
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
});

export default function Archive() {
    const posts = getPosts();

    return (
        <Main>
            <PageHeader heading="Archive" intro={description} />

            <div {...stylex.props(styles.years)}>
                {getPostsByYear(posts).map(
                    ({ year, posts: entries }, index) => (
                        <section
                            key={year}
                            {...stylex.props(
                                index > 0 && styles.yearSpaced,
                                reveal(index)
                            )}
                        >
                            <SectionLabel
                                action={
                                    <span {...stylex.props(styles.count)}>
                                        {entries.length}
                                    </span>
                                }
                            >
                                {year}
                            </SectionLabel>
                            <div {...stylex.props(styles.list)}>
                                {entries.map((post, row) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        // Every row is on screen at once here,
                                        // and a prefetch pulls the post payload
                                        // plus its hero image -- 33 of them,
                                        // for images this page never renders.
                                        prefetch={false}
                                        {...stylex.props(
                                            styles.row,
                                            row > 0 && styles.divided,
                                            stylex.defaultMarker()
                                        )}
                                    >
                                        <FormattedDate
                                            date={post.pubDate}
                                            style={styles.date}
                                        />
                                        <span {...stylex.props(styles.title)}>
                                            {post.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )
                )}
            </div>
        </Main>
    );
}
