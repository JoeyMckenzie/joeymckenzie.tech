import { Head, Link } from '@inertiajs/react';
import { DeletePostDialog } from '@/components/admin/delete-post-dialog';
import { PostEditorHeader } from '@/components/admin/post-editor-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { create, edit, index as postsIndex } from '@/routes/admin/posts';
import type { AdminPostRow, PostStatus } from '@/types';

const STATUS_STYLES: Record<PostStatus, string> = {
    published: 'border-iris bg-iris text-canvas',
    scheduled: 'border-iris/40 bg-iris/10 text-iris',
    draft: 'border-hairline bg-canvas text-subtle',
};

function PostStatusBadge({ status }: { status: PostStatus }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'rounded-sm px-2 py-1 font-mono text-[0.625rem] tracking-[0.12em] uppercase',
                STATUS_STYLES[status],
            )}
        >
            {status}
        </Badge>
    );
}

function PostActions({
    post,
    className,
}: {
    post: AdminPostRow;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="border-hairline bg-panel font-mono text-xs text-prose shadow-none hover:bg-canvas hover:text-iris focus-visible:border-iris focus-visible:ring-iris/20"
                render={<Link href={edit({ post: post.id })}>Edit</Link>}
            />

            <DeletePostDialog post={post} />
        </div>
    );
}

function MobilePostCard({ post }: { post: AdminPostRow }) {
    return (
        <article
            aria-labelledby={`post-${post.id}-title`}
            className="flex min-w-0 flex-col gap-5 rounded-lg border border-hairline bg-panel p-5"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="max-w-[60%] truncate font-mono text-[0.6875rem] tracking-[0.12em] text-iris uppercase">
                    {post.tag}
                </span>
                <PostStatusBadge status={post.status} />
            </div>

            <div className="min-w-0">
                <h2
                    id={`post-${post.id}-title`}
                    className="font-display text-2xl leading-tight font-medium tracking-tight break-words text-prose"
                >
                    <Link
                        href={edit({ post: post.id })}
                        className="decoration-iris underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-iris"
                    >
                        {post.title}
                    </Link>
                </h2>
                <p className="mt-2 truncate font-mono text-xs text-subtle">
                    /blog/{post.slug}
                </p>
            </div>

            <dl className="grid grid-cols-2 border-y border-hairline">
                <div className="flex min-w-0 flex-col gap-1 border-r border-b border-hairline py-3 pr-3">
                    <dt className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle uppercase">
                        Published
                    </dt>
                    <dd className="truncate text-sm text-prose">
                        {post.publishedLabel ?? 'Not published'}
                    </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1 border-b border-hairline py-3 pl-3">
                    <dt className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle uppercase">
                        Updated
                    </dt>
                    <dd className="truncate text-sm text-prose">
                        {post.updatedLabel ?? 'Not recorded'}
                    </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1 border-r border-hairline py-3 pr-3">
                    <dt className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle uppercase">
                        Reading
                    </dt>
                    <dd className="font-mono text-sm text-prose">
                        {post.readingMinutes} min
                    </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1 py-3 pl-3">
                    <dt className="font-mono text-[0.625rem] tracking-[0.12em] text-subtle uppercase">
                        Views
                    </dt>
                    <dd className="font-mono text-sm text-prose">
                        {post.views}
                    </dd>
                </div>
            </dl>

            <PostActions post={post} className="justify-end" />
        </article>
    );
}

export default function PostsIndex({ posts }: { posts: AdminPostRow[] }) {
    const postCountLabel = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;

    return (
        <>
            <Head title="Posts" />

            <div className="min-h-full flex-1 bg-canvas px-4 py-8 font-body text-prose sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                    <PostEditorHeader
                        path="admin / posts / index"
                        title="Posts"
                        description="Drafts, scheduled stories, and published work arranged as one editorial catalog."
                        action={
                            <Button
                                nativeButton={false}
                                className="bg-iris font-mono text-xs text-canvas shadow-none hover:bg-iris/90 focus-visible:border-iris focus-visible:ring-iris/30"
                                render={<Link href={create()}>New post</Link>}
                            />
                        }
                    />

                    {posts.length === 0 ? (
                        <section
                            aria-labelledby="empty-posts-title"
                            className="flex min-h-80 flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-hairline bg-panel/50 px-6 py-12 text-center"
                        >
                            <div className="flex max-w-md flex-col items-center gap-3">
                                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-iris uppercase">
                                    The editorial desk is clear
                                </p>
                                <h2
                                    id="empty-posts-title"
                                    className="font-display text-3xl font-medium tracking-tight text-prose sm:text-4xl"
                                >
                                    Start the first story.
                                </h2>
                                <p className="text-sm leading-6 text-subtle">
                                    Create a draft now. It will stay in this
                                    catalog while you write, schedule, and
                                    publish it.
                                </p>
                            </div>

                            <Button
                                nativeButton={false}
                                className="bg-iris font-mono text-xs text-canvas shadow-none hover:bg-iris/90 focus-visible:border-iris focus-visible:ring-iris/30"
                                render={
                                    <Link href={create()}>
                                        Write your first post
                                    </Link>
                                }
                            />
                        </section>
                    ) : (
                        <section
                            aria-labelledby="post-catalog-title"
                            className="flex flex-col gap-5"
                        >
                            <div className="flex items-end justify-between gap-4 border-b border-hairline pb-3">
                                <div>
                                    <p className="font-mono text-[0.625rem] tracking-[0.14em] text-iris uppercase">
                                        Editorial catalog
                                    </p>
                                    <h2
                                        id="post-catalog-title"
                                        className="mt-1 font-display text-2xl font-medium tracking-tight text-prose"
                                    >
                                        All stories
                                    </h2>
                                </div>
                                <p className="font-mono text-xs text-subtle">
                                    {postCountLabel}
                                </p>
                            </div>

                            <div className="grid min-w-0 gap-4 xl:hidden">
                                {posts.map((post) => (
                                    <MobilePostCard key={post.id} post={post} />
                                ))}
                            </div>

                            <div className="hidden overflow-hidden rounded-lg border border-hairline bg-panel xl:block">
                                <Table className="table-fixed">
                                    <TableCaption className="sr-only">
                                        {postCountLabel} with publication and
                                        engagement details.
                                    </TableCaption>
                                    <TableHeader className="bg-canvas/70">
                                        <TableRow className="border-hairline hover:bg-canvas/70">
                                            <TableHead className="w-[38%] px-5 font-mono text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
                                                Story
                                            </TableHead>
                                            <TableHead className="w-[13%] font-mono text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-[19%] font-mono text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
                                                Publication
                                            </TableHead>
                                            <TableHead className="w-[15%] font-mono text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
                                                Reading / reach
                                            </TableHead>
                                            <TableHead className="w-[15%] px-5 text-right font-mono text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {posts.map((post) => (
                                            <TableRow
                                                key={post.id}
                                                className="border-hairline hover:bg-iris/[0.04]"
                                            >
                                                <TableCell className="min-w-0 px-5 py-5 align-top">
                                                    <Link
                                                        href={edit({
                                                            post: post.id,
                                                        })}
                                                        className="font-display text-lg leading-tight font-medium [overflow-wrap:anywhere] break-words text-prose decoration-iris underline-offset-4 hover:text-iris hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-iris"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <div className="mt-2 flex min-w-0 items-center gap-2 font-mono text-[0.6875rem]">
                                                        <span className="max-w-[35%] truncate text-iris">
                                                            {post.tag}
                                                        </span>
                                                        <span
                                                            aria-hidden
                                                            className="text-hairline"
                                                        >
                                                            /
                                                        </span>
                                                        <span className="truncate text-subtle">
                                                            /blog/{post.slug}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="py-5 align-top">
                                                    <PostStatusBadge
                                                        status={post.status}
                                                    />
                                                </TableCell>

                                                <TableCell className="py-5 align-top">
                                                    <p className="text-sm text-prose">
                                                        {post.publishedLabel ??
                                                            'Not published'}
                                                    </p>
                                                    <p className="mt-2 font-mono text-[0.6875rem] text-subtle">
                                                        Updated{' '}
                                                        {post.updatedLabel ??
                                                            'not recorded'}
                                                    </p>
                                                </TableCell>

                                                <TableCell className="py-5 align-top font-mono text-xs">
                                                    <p className="text-prose">
                                                        {post.readingMinutes}{' '}
                                                        min read
                                                    </p>
                                                    <p className="mt-2 text-subtle">
                                                        {post.views} views
                                                    </p>
                                                </TableCell>

                                                <TableCell className="px-5 py-5 align-top">
                                                    <PostActions
                                                        post={post}
                                                        className="justify-end"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}

PostsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Posts',
            href: postsIndex(),
        },
    ],
};
