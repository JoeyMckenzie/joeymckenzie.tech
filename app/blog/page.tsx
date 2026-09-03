import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";

import { Main } from "@/components/main";
import { PageHeader } from "@/components/page-header";
import { PostFilters } from "@/components/post-filters";
import { getPosts, getTags } from "@/lib/posts";

export const metadata: Metadata = {
    title: "Writing",
    description:
        "Writing about Laravel, PHP, and whatever has my attention this month.",
};

const styles = stylex.create({
    filters: { marginTop: 56 },
});

export default function BlogIndex() {
    const posts = getPosts();

    return (
        <Main>
            <PageHeader
                heading="Writing"
                intro="Laravel, Rust, .NET, and whatever tooling rabbit hole has me this month. Mostly code, occasionally opinions."
            />
            <div {...stylex.props(styles.filters)}>
                <PostFilters posts={posts} tags={getTags(posts)} />
            </div>
        </Main>
    );
}
