import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Reactions } from '@/components/blog/reactions';
import { useAppearance } from '@/hooks/use-appearance';
import { mermaidTheme } from '@/lib/mermaid-theme';
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
 * Renders the stored Phiki-highlighted `content_html` inside the Nocturne
 * article prose, initialises any Mermaid diagrams client-side, and mounts the
 * anonymous reactions widget (JOEY-9 API).
 */
export default function BlogShow({ post }: { post: Article }) {
    const articleRef = useRef<HTMLElement>(null);
    // Diagram sources, stashed on first render so re-theming can re-run Mermaid
    // (mermaid.run replaces each node's innerHTML with the rendered SVG).
    const sources = useRef<Map<Element, string>>(new Map());
    const { resolvedAppearance } = useAppearance();

    useEffect(() => {
        const article = articleRef.current;

        if (article === null) {
            return;
        }

        const nodes = Array.from(
            article.querySelectorAll<HTMLElement>('.mermaid'),
        );

        if (nodes.length === 0) {
            return;
        }

        let cancelled = false;

        // Lazy-load Mermaid only when a post actually contains a diagram.
        void (async () => {
            const mermaid = (await import('mermaid')).default;

            if (cancelled) {
                return;
            }

            nodes.forEach((node) => {
                if (!sources.current.has(node)) {
                    sources.current.set(node, node.textContent ?? '');
                }

                node.innerHTML = sources.current.get(node) ?? '';
                node.removeAttribute('data-processed');
            });

            mermaid.initialize(mermaidTheme(resolvedAppearance));
            await mermaid.run({ nodes });
        })();

        return () => {
            cancelled = true;
        };
    }, [resolvedAppearance]);

    return (
        <>
            <Head title={post.title}>
                <meta name="description" content={post.description} />
            </Head>

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

                {/* Server-rendered Phiki HTML; Mermaid blocks are initialised above. */}
                <article
                    ref={articleRef}
                    className="prose-nocturne mt-10"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />

                <Reactions postSlug={post.slug} />
            </div>
        </>
    );
}
