import { getViewCount } from "@/lib/db";
import { Post } from "contentlayer/generated";
import { format } from "date-fns";
import Link from "next/link";
import * as React from "react";
import { Suspense } from "react";
import { Badge } from "./ui/badge";
import ViewCounter from "./view-counter";

async function Views({ slug }: { slug: string }) {
  const views = await getViewCount(slug);
  return <ViewCounter viewsForSlug={views} />;
}

export default function BlogCard({ post }: { post: Post }): React.JSX.Element {
  const formattedDate = format(new Date(post.pubDate), "PP");

  return (
    <article className="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1">
      <Link href={post.url}>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime="frontMatter.published_date">{formattedDate}</time>
          <Badge>{post.category}</Badge>
          <Suspense fallback={<p className="h-6" />}>
            <Views slug={post.slug} />
          </Suspense>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6">
            <span className="absolute inset-0" />
            {post.title}
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6">
            {post.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
