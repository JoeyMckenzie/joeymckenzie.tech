import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FormattedDate } from "@/components/formatted-date";
import { Prose } from "@/components/prose";
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
        <main className="mx-auto w-full max-w-3xl px-4 py-16">
            <article>
                <header className="mb-10">
                    <h1 className="font-heading text-4xl font-semibold tracking-tight">
                        {post.title}
                    </h1>
                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
                        <FormattedDate date={post.pubDate} />
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingMinutes} min read</span>
                    </div>
                    {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="font-mono"
                                    render={<Link href={`/blog/?tag=${tag}`} />}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </header>

                {post.heroImage && (
                    /* eslint-disable-next-line @next/next/no-img-element --
                       see components/post-card.tsx */
                    <img
                        src={post.heroImage}
                        alt=""
                        className="mb-10 w-full rounded-xl border"
                    />
                )}

                <Prose>
                    <Body />
                </Prose>
            </article>
        </main>
    );
}
