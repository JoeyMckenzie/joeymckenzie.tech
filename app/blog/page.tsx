import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { PostFilters } from "@/components/post-filters";
import { getPosts, getTags } from "@/lib/posts";

export const metadata: Metadata = {
    title: "Writing",
    description:
        "Writing about Laravel, PHP, and whatever has my attention this month.",
};

export default function BlogIndex() {
    const posts = getPosts();

    return (
        <main className="mx-auto w-full max-w-3xl px-4 pt-20 pb-24">
            <PageHeader
                heading="Writing"
                intro="Laravel, Rust, .NET, and whatever tooling rabbit hole has me this month. Mostly code, occasionally opinions."
            />
            <div className="mt-14">
                <PostFilters posts={posts} tags={getTags(posts)} />
            </div>
        </main>
    );
}
