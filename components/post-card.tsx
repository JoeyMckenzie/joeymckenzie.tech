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
    // Positioned ancestor for the stretched link in `titleLink`.
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
        // Stretches the link over the whole row.
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
    // Keeps the tag above the stretched `::after` so it stays clickable.
    postTag: { position: "relative", marginTop: 14 },
});

export function PostCard({
    post,
    onTagClick,
}: {
    post: Post;
    onTagClick?: (tag: string) => void;
}) {
    const tag = post.tags[0];

    return (
        <article {...stylex.props(styles.article, stylex.defaultMarker())}>
            <div {...stylex.props(styles.row)}>
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
                        {/* Only ever true under `next dev`, so this renders
                            nothing in a production build. */}
                        {post.draft && (
                            <Badge variant="solid" style={badgeStyles.tag}>
                                draft
                            </Badge>
                        )}
                    </div>
                    <h3 {...stylex.props(styles.title)}>
                        <Link
                            href={`/blog/${post.slug}`}
                            // The handle `post-filters` walks with `j` / `k`.
                            data-post-link
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
