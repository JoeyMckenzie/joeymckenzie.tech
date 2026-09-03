"use client";

import * as stylex from "@stylexjs/stylex";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { colors, radius } from "@/app/tokens.stylex";
import { Badge, badgeStyles } from "@/components/badge";
import { Button } from "@/components/button";
import { PostCard } from "@/components/post-card";
import { reveal } from "@/components/reveal";
import { SearchInput } from "@/components/search-input";
import type { Post } from "@/lib/posts";

const styles = stylex.create({
    root: { display: "flex", flexDirection: "column", gap: 32 },
    tagRow: { display: "flex", flexWrap: "wrap", gap: 8 },
    count: { opacity: 0.6 },
    // Tailwind's `divide-y border-t` drew a rule above every row including the
    // first. StyleX generates no `& > * + *` selector, so the rule lives on the
    // row itself, which produces the same set of hairlines.
    divided: {
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
    },
    // The empty state was six shadcn components deep for one bordered box.
    empty: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.border,
        padding: 24,
        textAlign: "center",
        textWrap: "balance",
    },
    emptyHeader: {
        display: "flex",
        maxWidth: "24rem",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    emptyTitle: {
        fontSize: "0.875rem",
        fontWeight: 500,
        letterSpacing: "-0.015em",
    },
    emptyDescription: {
        color: colors.mutedForeground,
        fontSize: "0.875rem",
        lineHeight: 1.625,
    },
});

// The whole post list is already in the page, so filtering is a client-side
// concern -- a static export has no server to read `searchParams` on.
//
// Both filters start empty so this component prerenders with every post in the
// static HTML, which is what crawlers and readers without JS get. A
// `?tag=&search=` deep link is applied on mount from `location.search` rather
// than with `useSearchParams`, because reading search params during render
// opts the whole list out of prerendering and leaves an empty page behind.
//
// This is the one place Motion earns its bundle, and it is the only route that
// pays for it: +38.9 KB gzipped on `/blog`, measured against the same build
// with Motion removed. The home page and the post pages are unchanged.
//
// A named `<ViewTransition>` per row would do the same re-flow natively for
// nothing, and that was tried first. It loses here because the search box
// filters as you type: every keystroke would start a fresh ~400ms view
// transition, and they queue rather than interrupt. Motion's springs retarget
// mid-flight, which is the behaviour a live filter needs. Route changes, which
// *are* discrete, still use view transitions -- see `app/layout.tsx`.
//
// First paint is deliberately left to the CSS reveal instead.
// `<AnimatePresence initial={false}>` is what keeps Motion from writing an
// `opacity: 0` into the prerendered markup, which would blank all 33 posts for
// anyone without JS. Verified against `out/blog/index.html` after a build:
// 33 post links, zero `opacity:0`.
export function PostFilters({
    posts,
    tags,
}: {
    posts: Post[];
    tags: { tag: string; count: number }[];
}) {
    const [activeTag, setActiveTag] = useState("");
    const [query, setQuery] = useState("");
    const hydrated = useRef(false);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        /* eslint-disable react-hooks/set-state-in-effect -- seeding state
           from the URL is the one thing that has to happen after the
           prerender rather than during it, and it happens exactly once. */
        setActiveTag(params.get("tag") ?? "");
        setQuery(params.get("search") ?? "");
        /* eslint-enable react-hooks/set-state-in-effect */
        hydrated.current = true;
    }, []);

    // Mirror the filters back into the URL so a filtered view stays linkable.
    // `replaceState` rather than a router navigation: the App Router syncs with
    // it, and there is no payload to refetch.
    useEffect(() => {
        if (!hydrated.current) return;

        const timer = setTimeout(() => {
            const params = new URLSearchParams();

            if (activeTag) params.set("tag", activeTag);
            if (query) params.set("search", query);

            const search = params.toString();

            window.history.replaceState(
                null,
                "",
                search ? `?${search}` : window.location.pathname
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [activeTag, query]);

    const needle = query.trim().toLowerCase();
    const visible = posts.filter((post) => {
        const matchesTag = !activeTag || post.tags.includes(activeTag);
        const matchesQuery =
            !needle ||
            post.title.toLowerCase().includes(needle) ||
            post.description.toLowerCase().includes(needle);

        return matchesTag && matchesQuery;
    });

    function clear() {
        setActiveTag("");
        setQuery("");
    }

    // `useReducedMotion` reads the same media query the stylesheet does, so
    // the two motion layers stay in agreement rather than one animating while
    // the other sits still.
    const transition = reduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };

    return (
        <div {...stylex.props(styles.root)}>
            <div {...stylex.props(reveal(0))}>
                <SearchInput
                    type="search"
                    placeholder="Search posts…"
                    aria-label="Search posts"
                    autoComplete="off"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            <div {...stylex.props(styles.tagRow, reveal(1))}>
                <Badge
                    variant={activeTag ? "outline" : "solid"}
                    style={badgeStyles.tag}
                    render={
                        <button
                            type="button"
                            aria-pressed={!activeTag}
                            onClick={() => setActiveTag("")}
                        />
                    }
                >
                    all
                </Badge>
                {tags.map(({ tag, count }) => (
                    <Badge
                        key={tag}
                        variant={activeTag === tag ? "solid" : "outline"}
                        style={badgeStyles.tag}
                        render={
                            <button
                                type="button"
                                aria-pressed={activeTag === tag}
                                onClick={() =>
                                    setActiveTag(activeTag === tag ? "" : tag)
                                }
                            />
                        }
                    >
                        {tag}
                        <span {...stylex.props(styles.count)}>{count}</span>
                    </Badge>
                ))}
            </div>

            {visible.length > 0 ? (
                <div>
                    {/* `popLayout` takes a leaving row out of flow immediately,
                        so the rows below it slide up into the gap rather than
                        waiting for the fade to finish. */}
                    <AnimatePresence initial={false} mode="popLayout">
                        {visible.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={transition}
                            >
                                {/* The CSS reveal sits on an inner element on
                                    purpose. A finished `.reveal` keeps its
                                    end frame (`animation-fill-mode: both`),
                                    and a CSS animation outranks inline
                                    styles -- on the same node it would pin
                                    opacity and transform and silently kill
                                    every Motion layout animation after the
                                    first paint. */}
                                <div
                                    {...stylex.props(
                                        styles.divided,
                                        reveal(index)
                                    )}
                                >
                                    <PostCard
                                        post={post}
                                        onTagClick={setActiveTag}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div {...stylex.props(styles.empty)}>
                    <div {...stylex.props(styles.emptyHeader)}>
                        <p {...stylex.props(styles.emptyTitle)}>No matches</p>
                        <p {...stylex.props(styles.emptyDescription)}>
                            {activeTag
                                ? `Nothing fits that filter in ${activeTag}.`
                                : "Nothing fits that filter."}
                        </p>
                    </div>
                    <Button onClick={clear}>Clear filters</Button>
                </div>
            )}
        </div>
    );
}
