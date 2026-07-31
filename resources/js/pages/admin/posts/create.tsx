import { Head } from '@inertiajs/react';
import { PostForm } from '@/components/admin/post-form';
import { Heading } from '@/components/heading';
import { create, index as postsIndex } from '@/routes/admin/posts';
import type { TagOption } from '@/types';

export default function PostsCreate({ tags }: { tags: TagOption[] }) {
    return (
        <>
            <Head title="New post" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New post"
                    description="Drafts stay private until you publish or schedule them."
                />

                <PostForm tags={tags} />
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
