import { Head } from '@inertiajs/react';
import { PostEditorHeader } from '@/components/admin/post-editor-header';
import { PostForm } from '@/components/admin/post-form';
import { buttonVariants } from '@/components/ui/button';
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

            <div className="min-h-full flex-1 bg-canvas px-4 py-8 font-body text-prose sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
                    <PostEditorHeader
                        path="admin / posts / edit"
                        title="Edit post"
                        description={`${post.views} views since publishing. Refine the story without changing how it reaches readers.`}
                        action={
                            post.status === 'published' ? (
                                <a
                                    href={show.url({ post: post.slug })}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                        className:
                                            'border-hairline bg-panel text-prose hover:bg-canvas hover:text-iris',
                                    })}
                                >
                                    View live
                                </a>
                            ) : undefined
                        }
                    />

                    <PostForm tags={tags} post={post} />
                </div>
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
