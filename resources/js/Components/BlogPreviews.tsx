import BlogCard from "@/Components/BlogCard";
import { type FrontMatter } from "@/models";
import * as React from "react";

export default function BlogPreviews({
    frontMatters,
}: {
    frontMatters: FrontMatter[];
}): React.JSX.Element {
    return (
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3">
            {frontMatters.map((frontMatter) => (
                <BlogCard key={frontMatter.title} frontMatter={frontMatter} />
            ))}
        </div>
    );
}
