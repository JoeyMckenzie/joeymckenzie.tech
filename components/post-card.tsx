import Link from "next/link";
import { ViewTransition } from "react";

import { FormattedDate } from "@/components/formatted-date";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/posts";

export function PostCard({
    post,
    onTagClick,
}: {
    post: Post;
    /**
     * Supplied by `PostFilters`, where a tag click has to set filter state
     * rather than navigate: the blog index is already `/blog`, and a same-route
     * `<Link>` does not remount the filters, so the URL would change without
     * the list following. Elsewhere (the home page) the tag is a plain link to
     * the filtered index, which mounts the filters fresh.
     */
    onTagClick?: (tag: string) => void;
}) {
    const tag = post.tags[0];

    return (
        // A row divided by a rule rather than a card. The rule itself comes
        // from `divide-y` on the list container, not from here -- the reveal
        // animation wraps each row in its own element, so a `last:` selector
        // on the article would never match.
        //
        // The `relative` is not cosmetic: it is the positioned ancestor the
        // stretched title link below anchors to, and removing it would make
        // the link cover the whole page.
        <article className="group relative py-7">
            <div className="flex items-start gap-5">
                {post.heroImage && (
                    // Morphs into the hero on the post page, which is what
                    // makes a click feel like the same object opening rather
                    // than one page replacing another. `default="none"` keeps
                    // it from crossfading on every unrelated navigation.
                    <ViewTransition
                        name={`hero-${post.slug}`}
                        share="morph"
                        default="none"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element --
                            a static export ships images unoptimized, and the
                            frontmatter carries no intrinsic dimensions for
                            next/image to require. */}
                        <img
                            src={post.heroImage}
                            alt=""
                            loading="lazy"
                            className="border-border/70 size-16 shrink-0 rounded-md border object-cover opacity-85 grayscale-[0.55] transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 max-sm:hidden"
                        />
                    </ViewTransition>
                )}
                <div className="min-w-0 flex-1">
                    <div className="text-muted-foreground text-label tracking-label flex items-center gap-2 font-mono uppercase">
                        <FormattedDate date={post.pubDate} />
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingMinutes} min</span>
                    </div>
                    <h3 className="font-heading text-title mt-2.5 font-medium tracking-tight">
                        {/* Stretched over the whole row, so the row is one
                            click target while the tag below stays separately
                            clickable. Nesting the tag inside this link would
                            be invalid HTML and would swallow its clicks. */}
                        <Link
                            href={`/blog/${post.slug}`}
                            className="group-hover:text-primary transition-colors duration-200 after:absolute after:inset-0"
                        >
                            {post.title}
                        </Link>
                    </h3>
                    <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm">
                        {post.description}
                    </p>
                    {tag &&
                        (onTagClick ? (
                            <Badge
                                variant="outline"
                                className="text-label tracking-label relative mt-3.5 cursor-pointer font-mono uppercase"
                                render={
                                    <button
                                        type="button"
                                        onClick={() => onTagClick(tag)}
                                    />
                                }
                            >
                                {tag}
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="text-label tracking-label relative mt-3.5 font-mono uppercase"
                                render={<Link href={`/blog/?tag=${tag}`} />}
                            >
                                {tag}
                            </Badge>
                        ))}
                </div>
            </div>
        </article>
    );
}
