import { Head } from '@inertiajs/react';
import { PostEditorHeader } from '@/components/admin/post-editor-header';
import { PostForm } from '@/components/admin/post-form';
import { create, index as postsIndex } from '@/routes/admin/posts';
import type { TagOption } from '@/types';

export default function PostsCreate({ tags }: { tags: TagOption[] }) {
    return (
        <>
            <Head title="New post" />

            <div className="min-h-full flex-1 bg-canvas px-4 py-8 font-body text-prose sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                    <PostEditorHeader
                        path="admin / posts / create"
                        title="New post"
                        description="Draft in private, then publish now or schedule the story for later."
                    />

                    <PostForm tags={tags} />
                </div>
            </div>
        </>
    );
}

PostsCreate.layout = {
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
        { title: 'Create', href: create() },
    ],
};
