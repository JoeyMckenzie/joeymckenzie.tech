import { Head } from '@inertiajs/react';
import { PostForm } from '@/components/admin/post-form';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { edit, index as postsIndex } from '@/routes/admin/posts';
import { show } from '@/routes/blog';
import type { AdminPostFormValues, TagOption } from '@/types';

export default function PostsEdit({
    post,
    tags,
}: {
    post: AdminPostFormValues;
    tags: TagOption[];
}) {
    return (
        <>
            <Head title={`Edit ${post.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 lg:p-6">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        variant="small"
                        title={post.title}
                        description={`${post.views} views since publishing.`}
                    />

                    {post.status === 'published' && (
                        <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={
                                <a
                                    href={show.url({ post: post.slug })}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View live
                                </a>
                            }
                        />
                    )}
                </div>

                <PostForm tags={tags} post={post} />
            </div>
        </>
    );
}

PostsEdit.layout = ({ post }: { post: AdminPostFormValues }) => ({
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
        { title: post.title, href: edit({ post: post.id }) },
    ],
});
