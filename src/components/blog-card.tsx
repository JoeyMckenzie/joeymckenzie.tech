import { PostWithViewCount } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import * as React from "react";
import { Badge } from "./ui/badge";

export default function BlogCard({
  frontMatter,
}: {
  frontMatter: PostWithViewCount;
}): React.JSX.Element {
  const formattedDate = format(new Date(frontMatter.pubDate), "PP");

  return (
    <article className="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1">
      <Link href={frontMatter.url}>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime="frontMatter.published_date">{formattedDate}</time>
          <Badge>{frontMatter.category}</Badge>
          {frontMatter.viewCount > 0 && (
            <div className="font-medium text-neutral-400">
              {frontMatter.viewCount} views
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
  );
}
