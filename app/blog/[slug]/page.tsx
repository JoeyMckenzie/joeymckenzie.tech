import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import {
    breakpoints,
    colors,
    fonts,
    radius,
    text,
    tracking,
} from "@/app/tokens.stylex";
import { Badge, badgeStyles } from "@/components/badge";
import { FormattedDate } from "@/components/formatted-date";
import { Main } from "@/components/main";
import { Prose } from "@/components/prose";
import { reveal } from "@/components/reveal";
import { getPost, getPosts } from "@/lib/posts";

const styles = stylex.create({
    header: { marginBottom: 48 },
    meta: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    title: {
        marginTop: 16,
        fontSize: { default: "2.25rem", [breakpoints.sm]: "3rem" },
        lineHeight: 1.1,
        fontWeight: 600,
        letterSpacing: "-0.015em",
        textWrap: "balance",
    },
    description: {
        marginTop: 20,
        maxWidth: "42rem",
        color: colors.mutedForeground,
        fontSize: "1.125rem",
        lineHeight: 1.625,
    },
    tags: { marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 },
    hero: {
        marginBottom: 48,
        width: "100%",
        borderRadius: radius.lg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
    },
});

export function generateStaticParams() {
    return getPosts().map((post) => ({ slug: post.slug }));
}

// A static export cannot render a slug that was not built.
export const dynamicParams = false;

export async function generateMetadata({
    params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) return {};

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            publishedTime: post.pubDate,
            images: post.heroImage ? [post.heroImage] : undefined,
        },
    };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) notFound();

    // Turbopack turns this template literal into a context module over
    // `content/blog/*.md`, so every post compiles at build time.
    //
    // Relative, not the `@/` alias this file uses everywhere else. Adding
    // StyleX put a Babel pass in front of Turbopack, and a file that has been
    // through a loader no longer gets the alias applied when the context
    // module resolves -- `@/content/blog/` <dynamic> `.md` fails to resolve
    // and the build dies here. A relative specifier needs no alias.
    const { default: Body } = await import(`../../../content/blog/${slug}.md`);

    return (
        <Main>
            <article>
                <header {...stylex.props(styles.header)}>
                    <div {...stylex.props(styles.meta, reveal(0))}>
                        <FormattedDate date={post.pubDate} />
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingMinutes} min read</span>
                    </div>
                    <h1 {...stylex.props(styles.title, reveal(1))}>
                        {post.title}
                    </h1>
                    {post.description && (
                        <p {...stylex.props(styles.description, reveal(2))}>
                            {post.description}
                        </p>
                    )}
                    {post.tags.length > 0 && (
                        <div {...stylex.props(styles.tags, reveal(3))}>
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    style={badgeStyles.tag}
                                    render={<Link href={`/blog/?tag=${tag}`} />}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </header>

                {post.heroImage && (
                    // The other half of the morph started by the thumbnail in
                    // `components/post-card.tsx` -- the same `name` is what
                    // tells the browser these are one object, so the row image
                    // grows into this one instead of the pages swapping.
                    <ViewTransition
                        name={`hero-${post.slug}`}
                        share="morph"
                        default="none"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element --
                            see components/post-card.tsx */}
                        <img
                            src={post.heroImage}
                            alt=""
                            {...stylex.props(styles.hero)}
                        />
                    </ViewTransition>
                )}

                <Prose>
                    <Body />
                </Prose>
            </article>
        </Main>
    );
}
