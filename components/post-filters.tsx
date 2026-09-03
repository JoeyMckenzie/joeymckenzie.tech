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
    divided: {
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
    },
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
    const searchRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        /* eslint-disable react-hooks/set-state-in-effect -- seeded from the URL once, after prerender */
        setActiveTag(params.get("tag") ?? "");
        setQuery(params.get("search") ?? "");
        /* eslint-enable react-hooks/set-state-in-effect */

        hydrated.current = true;
    }, []);

    useEffect(() => {
        if (!hydrated.current) {
            return;
        }

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

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.metaKey || event.ctrlKey || event.altKey) return;

            // Never steal a key from something being typed into.
            const target = event.target as HTMLElement | null;

            if (
                target?.isContentEditable ||
                ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
            ) {
                return;
            }

            if (event.key === "/") {
                event.preventDefault();
                searchRef.current?.querySelector("input")?.focus();
                return;
            }

            if (event.key !== "j" && event.key !== "k") return;

            const links = [
                ...(listRef.current?.querySelectorAll<HTMLAnchorElement>(
                    "[data-post-link]"
                ) ?? []),
            ];

            if (links.length === 0) return;

            const current = links.indexOf(
                document.activeElement as HTMLAnchorElement
            );
            // From nothing focused, `k` should enter the list at the bottom
            // rather than clamp to the row `j` would have picked.
            const next =
                current === -1 && event.key === "k"
                    ? links.length - 1
                    : Math.min(
                          Math.max(current + (event.key === "j" ? 1 : -1), 0),
                          links.length - 1
                      );

            event.preventDefault();
            links[next]?.focus({ preventScroll: true });
            links[next]?.scrollIntoView({
                block: "center",
                behavior: reduceMotion ? "auto" : "smooth",
            });
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [reduceMotion]);

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

    const transition = reduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };

    return (
        <div {...stylex.props(styles.root)}>
            <div ref={searchRef} {...stylex.props(reveal(0))}>
                <SearchInput
                    type="search"
                    placeholder="Search posts…"
                    aria-label="Search posts"
                    autoComplete="off"
                    hint="/"
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
                <div ref={listRef}>
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
                                {/* Inner element: a CSS animation outranks
                                    inline styles and would kill Motion's
                                    layout animations on the same node. */}
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
