import { Badge } from "@/Components/ui/badge";
import { type FrontMatter } from "@/models";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import * as React from "react";

export default function BlogCard({
    frontMatter,
}: {
    frontMatter: FrontMatter;
}): React.JSX.Element {
    const formattedDate = format(new Date(frontMatter.published_date), "PP");

    return (
        <>
            <Head>
                <meta content={frontMatter.keywords} title="keywords" />
            </Head>

            <article className="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1">
                <Link
                    href={route("post", {
                        slug: frontMatter.slug,
                    })}
                >
                    <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime="frontMatter.published_date">
                            {formattedDate}
                        </time>
                        <Badge>{frontMatter.category}</Badge>
                        {frontMatter.views > 0 && (
                            <div className="font-medium text-neutral-400">
                                {frontMatter.views} views
                            </div>
                        )}
                    </div>
                    <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6">
                            <span className="absolute inset-0" />
                            {frontMatter.title}
                        </h3>
                        <p className="mt-5 line-clamp-3 text-sm leading-6">
                            {frontMatter.description}
                        </p>
                    </div>
                </Link>
            </article>
        </>
    );
}
