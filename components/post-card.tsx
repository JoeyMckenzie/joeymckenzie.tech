import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { ViewTransition } from "react";

import {
    breakpoints,
    colors,
    fonts,
    text,
    tracking,
} from "@/app/tokens.stylex";
import { Badge, badgeStyles } from "@/components/badge";
import { FormattedDate } from "@/components/formatted-date";
import type { Post } from "@/lib/posts";

const styles = stylex.create({
    // The `position: relative` is not cosmetic: it is the positioned ancestor
    // the stretched title link anchors to, and removing it would make the link
    // cover the whole page.
    article: { position: "relative", paddingBlock: 28 },
    row: { display: "flex", alignItems: "flex-start", gap: 20 },
    image: {
        width: 64,
        height: 64,
        flexShrink: 0,
        borderRadius: "calc(0.625rem * 0.8)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: `color-mix(in oklab, ${colors.border} 70%, transparent)`,
        objectFit: "cover",
        // shadcn reached the hover state with a `group-hover:` variant.
        // `when.ancestor` is StyleX's version of the same relationship, and it
        // needs the marker that `article` carries below.
        opacity: { default: 0.85, [stylex.when.ancestor(":hover")]: 1 },
        filter: {
            default: "grayscale(0.55)",
            [stylex.when.ancestor(":hover")]: "grayscale(0)",
        },
        transitionProperty: "opacity, filter",
        transitionDuration: "500ms",
        display: { default: "block", [breakpoints.belowSm]: "none" },
    },
    body: { minWidth: 0, flex: "1" },
    meta: {
        display: "flex",
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
        marginTop: 10,
        fontSize: text.title,
        lineHeight: text.titleLineHeight,
        fontWeight: 500,
        letterSpacing: "-0.015em",
    },
    titleLink: {
        color: {
            default: "inherit",
            [stylex.when.ancestor(":hover")]: colors.primary,
        },
        textDecoration: "none",
        transitionProperty: "color",
        transitionDuration: "200ms",
        // The one pseudo-element worth keeping. It stretches the link over the
        // whole row so the row is a single click target while the tag below
        // stays separately clickable -- nesting the tag inside the link would
        // be invalid HTML and would swallow its clicks. No real element can do
        // this without becoming the thing that swallows them.
        "::after": { position: "absolute", inset: 0, content: "" },
    },
    description: {
        marginTop: 6,
        color: colors.mutedForeground,
        fontSize: "0.875rem",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    // The chip sits below the excerpt and above the stretched link's `::after`
    // -- `position: relative` is what keeps the tag clickable in its own right
    // rather than being swallowed by it.
    postTag: { position: "relative", marginTop: 14 },
});

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
        // A row divided by a rule rather than a card. The rule comes from the
        // list wrapper, not from here -- the reveal animation wraps each row in
        // its own element, so a `:last-child` rule on the article would never
        // match.
        <article {...stylex.props(styles.article, stylex.defaultMarker())}>
            <div {...stylex.props(styles.row)}>
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
                            {...stylex.props(styles.image)}
                        />
                    </ViewTransition>
                )}
                <div {...stylex.props(styles.body)}>
                    <div {...stylex.props(styles.meta)}>
                        <FormattedDate date={post.pubDate} />
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingMinutes} min</span>
                    </div>
                    <h3 {...stylex.props(styles.title)}>
                        <Link
                            href={`/blog/${post.slug}`}
                            {...stylex.props(styles.titleLink)}
                        >
                            {post.title}
                        </Link>
                    </h3>
                    <p {...stylex.props(styles.description)}>
                        {post.description}
                    </p>
                    {tag &&
                        (onTagClick ? (
                            <Badge
                                style={[badgeStyles.tag, styles.postTag]}
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
                                style={[badgeStyles.tag, styles.postTag]}
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
