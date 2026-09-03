import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTextIcon } from "lucide-react";
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
import { buttonStyles } from "@/components/button";
import { FormattedDate } from "@/components/formatted-date";
import { Main } from "@/components/main";
import { PostFooter } from "@/components/post-footer";
import { Prose } from "@/components/prose";
import { ReadingProgress } from "@/components/reading-progress";
import { reveal } from "@/components/reveal";
import { PostStructuredData } from "@/components/structured-data";
import { getPost, getPostNeighbors, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { alternates } from "@/lib/metadata";

const styles = stylex.create({
    header: { marginBottom: 48 },
    // The meta line and the markdown link share a row and wrap onto separate
    // ones together, rather than the link being squeezed on a narrow screen.
    topRow: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    // Mono and label-sized, so it reads as part of the instrumentation row it
    // sits in rather than as the one sans-serif control on the page. Passed in
    // by the caller, which is why `Button` still has exactly one variant.
    markdownButton: {
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        color: { default: colors.mutedForeground, ":hover": colors.primary },
        borderColor: { default: colors.input, ":hover": colors.ring },
        textDecoration: "none",
    },
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

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) return {};

    const url = `/blog/${post.slug}/`;

    return {
        title: post.title,
        description: post.description,
        alternates: alternates(url),
        // Page-level `openGraph` replaces the layout's object outright rather
        // than merging into it, so `siteName` and `locale` have to be repeated
        // here or the post cards lose them.
        openGraph: {
            type: "article",
            siteName: site.title,
            locale: "en_US",
            url,
            title: post.title,
            description: post.description,
            publishedTime: post.pubDate,
            authors: [site.author],
            tags: [...post.tags],
            images: post.heroImage ? [post.heroImage] : undefined,
        },
    };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) notFound();

    const { older, newer } = getPostNeighbors(slug);

    // Relative, not `@/`: the alias does not resolve in the context module.
    const { default: Body } = await import(`../../../content/blog/${slug}.md`);

    return (
        <Main>
            <ReadingProgress />
            <PostStructuredData post={post} />
            <article>
                <header {...stylex.props(styles.header)}>
                    <div {...stylex.props(styles.topRow, reveal(0))}>
                        <div {...stylex.props(styles.meta)}>
                            <FormattedDate date={post.pubDate} />
                            <span aria-hidden="true">&middot;</span>
                            <span>{post.readingMinutes} min read</span>
                        </div>
                        {/* A link, not a `Button`: it navigates, so it has to
                            be announced as a link. It borrows the button's
                            look rather than its semantics. */}
                        <a
                            href={`/blog/${post.slug}/index.md`}
                            {...stylex.props(
                                buttonStyles.button,
                                styles.markdownButton
                            )}
                        >
                            <FileTextIcon size={13} />
                            View as Markdown
                        </a>
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
                    <ViewTransition
                        name={`hero-${post.slug}`}
                        share="morph"
                        default="none"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images ship unoptimized */}
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

                <PostFooter slug={post.slug} older={older} newer={newer} />
            </article>
        </Main>
    );
}
