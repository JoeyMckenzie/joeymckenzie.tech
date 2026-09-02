import Link from "next/link";

import { FormattedDate } from "@/components/formatted-date";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className="group hover:bg-muted/40 relative transition-colors">
            <CardContent className="flex gap-4">
                {post.heroImage && (
                    /* eslint-disable-next-line @next/next/no-img-element --
                       a static export ships images unoptimized, and the
                       frontmatter carries no intrinsic dimensions for
                       next/image to require. */
                    <img
                        src={post.heroImage}
                        alt=""
                        loading="lazy"
                        className="size-20 shrink-0 rounded-lg border object-cover max-sm:hidden"
                    />
                )}
                <div className="min-w-0">
                    <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                        <FormattedDate date={post.pubDate} />
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingMinutes} min read</span>
                    </div>
                    <h3 className="font-heading mt-1.5 text-lg leading-snug font-medium">
                        {/* Stretched over the whole card, so the card is one
                            click target while the tag below stays separately
                            clickable. Nesting the tag inside this link would
                            be invalid HTML and would swallow its clicks. */}
                        <Link
                            href={`/blog/${post.slug}`}
                            className="group-hover:underline after:absolute after:inset-0"
                        >
                            {post.title}
                        </Link>
                    </h3>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {post.description}
                    </p>
                    {tag &&
                        (onTagClick ? (
                            <Badge
                                variant="outline"
                                className="relative mt-3 cursor-pointer font-mono"
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
                                className="relative mt-3 font-mono"
                                render={<Link href={`/blog/?tag=${tag}`} />}
                            >
                                {tag}
                            </Badge>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}
