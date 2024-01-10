import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViewCounter from "@/components/view-counter";
import { addViewCount, getViewCount } from "@/lib/db";
import { loadPost } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata> {
  const post = await loadPost(params.slug);

  return {
    title: `${post?.title} | joeymckenzie.tech`,
    keywords: post?.keywords ?? [],
  };
}

const incrementViews = cache(addViewCount);

async function Views({ slug }: { slug: string }) {
  const views = await getViewCount(slug);
  incrementViews(slug);
  return <ViewCounter viewsForSlug={views} />;
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await loadPost(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.pubDate ?? "").toLocaleDateString(
    "en-us",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <>
      <div className="flex flex-col justify-center">
        <article className="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
          <h1 className="text-center text-2xl">{post.title}</h1>
          <div className="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
            <time dateTime={post.pubDate}>{formattedDate}</time>
            <Badge>{post.category}</Badge>
            <Suspense fallback={<p className="h-5" />}>
              <Views slug={params.slug} />
            </Suspense>
          </div>
          <img
            alt={`${post.title} blog meme`}
            src={post.heroImage}
            height="400"
            width="500"
          />
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled input
            dangerouslySetInnerHTML={{
              __html: post.body.html,
            }}
          />
        </article>
        <Link href="/blog" className="mx-auto max-w-md">
          <Button variant="secondary"> Back to blogs</Button>
        </Link>
      </div>
    </>
  );
}
