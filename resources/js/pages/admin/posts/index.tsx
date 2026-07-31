import { Head, Link } from '@inertiajs/react';
import { DeletePostDialog } from '@/components/admin/delete-post-dialog';
import { Heading } from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { create, edit, index as postsIndex } from '@/routes/admin/posts';
import type { AdminPostRow, PostStatus } from '@/types';

const STATUS_VARIANTS: Record<PostStatus, 'default' | 'secondary' | 'outline'> =
    {
        published: 'default',
        scheduled: 'secondary',
        draft: 'outline',
    };

export default function PostsIndex({ posts }: { posts: AdminPostRow[] }) {
    return (
        <>
            <Head title="Posts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        variant="small"
                        title="Posts"
                        description="Every post, including drafts and scheduled ones."
                    />

                    <Button
                        nativeButton={false}
                        render={<Link href={create()}>New post</Link>}
                    />
                </div>

                {posts.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No posts yet. Everything you publish shows up here.
                        </p>

                        <Button
                            nativeButton={false}
                            render={
                                <Link href={create()}>
                                    Write your first post
                                </Link>
                            }
                        />
                    </div>
                ) : (
                    <div className="rounded-xl border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tag</TableHead>
                                    <TableHead>Published</TableHead>
                                    <TableHead className="text-right">
                                        Read
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Views
                                    </TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            <Link
                                                href={edit({ post: post.id })}
                                                className="font-medium text-foreground hover:underline"
                                            >
                                                {post.title}
                                            </Link>

                                            <p className="font-mono text-xs text-muted-foreground">
                                                /blog/{post.slug}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[post.status]
                                                }
                                            >
                                                {post.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {post.tag}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {post.publishedLabel ?? '—'}
                                        </TableCell>

                                        <TableCell className="text-right text-muted-foreground">
                                            {post.readingMinutes} min
                                        </TableCell>

                                        <TableCell className="text-right text-muted-foreground">
                                            {post.views}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {post.updatedLabel ?? '—'}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    nativeButton={false}
                                                    render={
                                                        <Link
                                                            href={edit({
                                                                post: post.id,
                                                            })}
                                                        >
                                                            Edit
                                                        </Link>
                                                    }
                                                />

                                                <DeletePostDialog post={post} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
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
