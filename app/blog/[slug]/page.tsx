import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { FormattedDate } from "@/components/formatted-date";
import { Prose } from "@/components/prose";
import { revealDelay } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts } from "@/lib/posts";

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
    const { default: Body } = await import(`@/content/blog/${slug}.md`);

    return (
        <main className="mx-auto w-full max-w-3xl px-4 pt-20 pb-24">
            <article>
                <header className="mb-12">
                    <div
                        className="text-muted-foreground text-label tracking-label reveal flex flex-wrap items-center gap-2 font-mono uppercase"
                        style={revealDelay(0)}
                    >
                        <FormattedDate date={post.pubDate} />
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingMinutes} min read</span>
                    </div>
                    <h1
                        className="font-heading reveal mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
                        style={revealDelay(1)}
                    >
                        {post.title}
                    </h1>
                    {post.description && (
                        <p
                            className="text-muted-foreground reveal mt-5 max-w-2xl text-lg leading-relaxed"
                            style={revealDelay(2)}
                        >
                            {post.description}
                        </p>
                    )}
                    {post.tags.length > 0 && (
                        <div
                            className="reveal mt-6 flex flex-wrap gap-2"
                            style={revealDelay(3)}
                        >
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-label tracking-label font-mono uppercase"
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
                            className="mb-12 w-full rounded-lg border"
                        />
                    </ViewTransition>
                )}

                <Prose>
                    <Body />
                </Prose>
            </article>
        </main>
    );
}
