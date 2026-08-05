import { Link } from '@inertiajs/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Reactions } from '@/components/blog/reactions';
import { RenderedMarkdown } from '@/components/blog/rendered-markdown';
import { Seo } from '@/components/seo';
import { index } from '@/routes/blog';

interface Article {
    title: string;
    slug: string;
    description: string;
    tag: string;
    cover: string | null;
    contentHtml: string;
    publishedAt: string;
    publishedLabel: string;
    readingMinutes: number;
    views: number;
}

/**
 * Blog post page (JOEY-4.3, backed by the JOEY-8 show endpoint).
 *
 * Renders the stored Phiki-highlighted `content_html` through the shared
 * article renderer — which also initialises any Mermaid diagrams client-side —
 * and mounts the anonymous reactions widget (JOEY-9 API).
 */
export default function BlogShow({ post }: { post: Article }) {
    return (
        <>
            <Seo
                title={post.title}
                description={post.description}
                image={post.cover}
                type="article"
                publishedTime={post.publishedAt}
                tag={post.tag}
            />

            <div className="mx-auto max-w-3xl px-6 py-16">
                <Link
                    href={index.url()}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-subtle transition-colors hover:text-iris"
                >
                    <ArrowLeft className="size-3.5" aria-hidden /> ~/blog
                </Link>

                <header className="mt-8">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-subtle">
                        <time dateTime={post.publishedAt}>
                            {post.publishedLabel}
                        </time>
                        <span aria-hidden>·</span>
                        <span className="text-iris">{post.tag}</span>
                    </div>
                    <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-prose sm:text-5xl">
                        {post.title}
                    </h1>
                    <div className="nocturne-sweep mt-5 w-40 rounded-full" />
                    <div className="mt-5 flex items-center gap-4 font-mono text-xs text-subtle">
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3.5" aria-hidden />{' '}
                            {post.readingMinutes} min
                        </span>
                    </div>
                </header>

                {post.cover && (
                    <img
                        src={post.cover}
                        alt=""
                        className="mt-8 w-full rounded-xl border border-hairline"
                    />
                )}

                {/* Server-rendered Phiki HTML; Mermaid runs client-side. */}
                <RenderedMarkdown html={post.contentHtml} className="mt-10" />

                <Reactions postSlug={post.slug} />
            </div>
        </>
    );
}
