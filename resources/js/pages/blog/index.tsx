import { Head, Link, router } from '@inertiajs/react';
import { useRef } from 'react';
import { index } from '@/actions/App/Http/Controllers/BlogController';
import { StaggeredItem, StaggeredList } from '@/components/motion';
import PostPreviewCard from '@/components/post-preview-card';
import type { PostSummary, Tag } from '@/types';

export default function BlogIndex({
    posts,
    tags,
    selectedTag,
    search,
}: {
    posts: PostSummary[];
    tags: Tag[];
    selectedTag: string | null;
    search: string | null;
}) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    function handleSearch(value: string) {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            router.get(
                index.url(),
                {
                    ...(selectedTag ? { tag: selectedTag } : {}),
                    ...(value ? { search: value } : {}),
                },
                { preserveState: true, preserveScroll: true },
            );
        }, 300);
    }

    return (
        <>
            <Head title="Blog">
                <meta
                    name="description"
                    content="Thoughts on software development, Laravel, PHP, Rust, and more."
                />
            </Head>

            <div className="space-y-2">
                <p className="font-mono text-xs tracking-wide text-muted-foreground">
                    ~/blog
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
                <p className="text-muted-foreground">
                    Thoughts on software development and things I find
                    interesting.
                </p>
            </div>

            <div className="mt-6 space-y-4">
                <input
                    type="text"
                    placeholder="Search posts..."
                    defaultValue={search ?? ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Link
                            key={tag.id}
                            href={index.url({
                                query: { tag: tag.name },
                            })}
                            preserveScroll
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                selectedTag === tag.name
                                    ? 'bg-foreground text-background'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                        >
                            {tag.hash_tagged}
                        </Link>
                    ))}
                </div>
            </div>

            <StaggeredList className="mt-8 space-y-8">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <StaggeredItem key={post.slug}>
                            <PostPreviewCard post={post} />
                        </StaggeredItem>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground">
                        No posts found.
                    </p>
                )}
            </StaggeredList>
        </>
    );
}
