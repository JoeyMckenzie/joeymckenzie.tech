import * as React from 'react';
import { type Post } from '@/models';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import '../../../../css/atom-one-dark.css';

export default function BlogPost({ post }: { post: Post }): React.JSX.Element {
    const formattedDate = new Date(
        post.published_date ?? '',
    ).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <>
            <Head title={`${post.title} | joeymckenzie.tech`} />

            <MainLayout>
                <div className="flex flex-col justify-center">
                    <article className="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
                        <h1 className="text-center text-2xl">{post.title}</h1>
                        <div className="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
                            <time dateTime={post.published_date}>
                                {formattedDate}
                            </time>
                            <Badge>{post.category}</Badge>
                            <p>{post.views} views</p>
                        </div>
                        <img
                            alt={`${post.title} hero image`}
                            src={post.hero_image}
                            height="400"
                            width="500"
                        />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: post.parsed_content,
                            }}
                        />
                    </article>
                    <Link href={route('blogs')} className="mx-auto max-w-md">
                        <Button variant="secondary"> Back to blogs</Button>
                    </Link>
                </div>
            </MainLayout>
        </>
    );
}
