import { Head, router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import PostCard from '@/components/blog/post-card';
import { cn } from '@/lib/utils';
import { index } from '@/routes/blog';
import type { BlogPost } from '@/types/blog';

interface BlogIndexProps {
    posts: BlogPost[];
    tags: string[];
    filters: {
        tag: string | null;
        search: string | null;
    };
}

/** Build a query object with only the active filters, so empty ones drop from the URL. */
function toParams(
    tag: string | null,
    search: string | null,
): Record<string, string> {
    const params: Record<string, string> = {};

    if (tag) {
        params.tag = tag;
    }

    if (search) {
        params.search = search;
    }

    return params;
}

export default function BlogIndex({ posts, tags, filters }: BlogIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

    function go(tag: string | null, nextSearch: string | null): void {
        router.get(index.url(), toParams(tag, nextSearch), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function onSearch(value: string): void {
        setSearch(value);
        clearTimeout(debounce.current);
        debounce.current = setTimeout(
            () => go(filters.tag, value || null),
            300,
        );
    }

    const hasFilters = filters.tag !== null || (filters.search ?? '') !== '';

    return (
        <>
            <Head title="Writing" />

            <div className="mx-auto max-w-3xl px-6 py-16">
                <header>
                    <p className="font-mono text-xs tracking-wide text-subtle">
                        ~/blog
                    </p>
                    <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-prose">
                        Writing
                    </h1>
                    <div className="nocturne-sweep mt-4 w-40 rounded-full" />
                    <p className="mt-4 max-w-xl text-subtle">
                        Laravel, Rust, .NET, and whatever tooling rabbit hole
                        has me this month. Mostly code, occasionally opinions.
                    </p>
                </header>

                {/* Filters — reflected in ?tag= and ?search */}
                <div className="mt-10 space-y-4">
                    <label className="relative block">
                        <Search
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => onSearch(event.target.value)}
                            placeholder="Search posts…"
                            aria-label="Search posts"
                            className="w-full rounded-lg border border-hairline bg-panel py-2.5 pr-3 pl-10 text-sm text-prose transition-colors placeholder:text-subtle focus:border-iris focus:ring-1 focus:ring-iris focus:outline-none"
                        />
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                        <TagChip
                            label="all"
                            active={filters.tag === null}
                            onClick={() => go(null, search || null)}
                        />
                        {tags.map((tag) => (
                            <TagChip
                                key={tag}
                                label={tag}
                                active={filters.tag === tag}
                                onClick={() =>
                                    go(
                                        filters.tag === tag ? null : tag,
                                        search || null,
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="mt-8">
                    {posts.length > 0 ? (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-hairline px-6 py-16 text-center">
                            <p className="font-display text-xl text-prose">
                                No matches
                            </p>
                            <p className="mt-2 text-sm text-subtle">
                                Nothing fits that filter
                                {filters.tag ? ` in ${filters.tag}` : ''}.
                            </p>
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        go(null, null);
                                    }}
                                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-iris hover:underline"
                                >
                                    <X className="size-3.5" aria-hidden /> clear
                                    filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function TagChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
                active
                    ? 'border-iris bg-iris/15 text-iris'
                    : 'border-hairline text-subtle hover:border-iris/50 hover:text-prose',
            )}
        >
            {label}
        </button>
    );
}
