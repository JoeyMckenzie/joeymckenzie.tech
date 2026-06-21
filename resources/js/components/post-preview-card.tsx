import { Link } from '@inertiajs/react';
import { show } from '@/actions/App/Http/Controllers/BlogController';
import { MagicCard } from '@/components/ui/magic-card';
import type { PostSummary } from '@/types';

export default function PostPreviewCard({ post }: { post: PostSummary }) {
    return (
        <MagicCard
            className="rounded-xl"
            gradientFrom="var(--primary)"
            gradientTo="var(--primary)"
            gradientColor="var(--primary)"
            gradientOpacity={0.07}
            gradientSize={180}
        >
            <article>
                <Link
                    href={show(post.slug)}
                    className="group block space-y-2 p-5"
                >
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                        <time>{post.formatted_published_at}</time>
                        <span>&middot;</span>
                        <span>{post.reading_time_minutes} min read</span>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">
                            {post.tag.hash_tagged}
                        </span>
                    </div>
                    <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                        {post.title}
                    </h2>
                    <p className="text-muted-foreground">{post.description}</p>
                </Link>
            </article>
        </MagicCard>
    );
}
