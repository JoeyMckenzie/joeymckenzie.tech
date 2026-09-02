"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import type { Post } from "@/lib/posts";

// The whole post list is already in the page, so filtering is a client-side
// concern -- a static export has no server to read `searchParams` on.
//
// Both filters start empty so this component prerenders with every post in the
// static HTML, which is what crawlers and readers without JS get. A
// `?tag=&search=` deep link is applied on mount from `location.search` rather
// than with `useSearchParams`, because reading search params during render
// opts the whole list out of prerendering and leaves an empty page behind.
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

    return (
        <div className="flex flex-col gap-6">
            <InputGroup>
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                    type="search"
                    placeholder="Search posts…"
                    aria-label="Search posts"
                    autoComplete="off"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </InputGroup>

            <div className="flex flex-wrap gap-2">
                <Badge
                    variant={activeTag ? "outline" : "default"}
                    className="cursor-pointer font-mono"
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
                        variant={activeTag === tag ? "default" : "outline"}
                        className="cursor-pointer font-mono"
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
                        <span className="opacity-70">{count}</span>
                    </Badge>
                ))}
            </div>

            {visible.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {visible.map((post) => (
                        <PostCard
                            key={post.slug}
                            post={post}
                            onTagClick={setActiveTag}
                        />
                    ))}
                </div>
            ) : (
                <Empty className="border">
                    <EmptyHeader>
                        <EmptyTitle>No matches</EmptyTitle>
                        <EmptyDescription>
                            {activeTag
                                ? `Nothing fits that filter in ${activeTag}.`
                                : "Nothing fits that filter."}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button variant="outline" size="sm" onClick={clear}>
                            Clear filters
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
        </div>
    );
}
