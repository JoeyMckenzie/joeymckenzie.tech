import { Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { show } from '@/routes/blog';
import type { BlogPost } from '@/types/blog';

interface PostCardProps {
    post: BlogPost;
    /** Defaults to `/blog/{slug}`; the index page (JOEY-4.2) can pass a Wayfinder route. */
    href?: string;
    className?: string;
}

/**
 * Nocturne reference element (JOEY-4.1).
 *
 * A text-first post row: a framed cover that rests desaturated and snaps to
 * full colour on hover (so meme covers read as curated plates), a Fraunces
 * title, and a Geist Mono metadata line. Proves the token system for the
 * index page (JOEY-4.2) to build on.
 */
export default function PostCard({ post, href, className }: PostCardProps) {
    return (
        <Link
            href={href ?? show.url({ post: post.slug })}
            className={cn(
                'group grid grid-cols-[auto_1fr] gap-5 rounded-xl border border-hairline bg-panel/40 p-4 transition-colors hover:bg-panel sm:gap-6 sm:p-5',
                className,
            )}
        >
            <div className="relative size-20 overflow-hidden rounded-lg border border-hairline sm:size-24">
                {post.cover ? (
                    <img
                        src={post.cover}
                        alt=""
                        className="size-full object-cover opacity-80 grayscale-[0.35] transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                ) : (
                    // Coverless fallback: an iris→ember plate carrying the tag initial.
                    <div className="flex size-full items-center justify-center bg-[linear-gradient(135deg,var(--iris),var(--ember))] opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="font-display text-2xl font-medium text-canvas">
                            {post.tag.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-wide text-subtle">
                    <time dateTime={post.publishedAt}>
                        {post.publishedLabel}
                    </time>
                    <span aria-hidden>·</span>
                    <span className="text-iris">{post.tag}</span>
                </div>

                <h3 className="mt-1.5 font-display text-xl leading-tight font-medium text-prose">
                    <span className="bg-[linear-gradient(var(--iris),var(--iris))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat pb-px transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">
                        {post.title}
                    </span>
                </h3>

                <p className="mt-1.5 line-clamp-2 text-sm text-subtle">
                    {post.description}
                </p>

                <div className="mt-3 flex items-center gap-4 font-mono text-[0.7rem] text-subtle">
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" aria-hidden />
                        {post.readingMinutes} min
                    </span>
                </div>
            </div>
        </Link>
    );
}
