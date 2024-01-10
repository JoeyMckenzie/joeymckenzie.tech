import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addViewCount } from "@/lib/db";
import { loadPost } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata> {
  const post = await loadPost(params.slug);

  return {
    title: `${post?.title} | joeymckenzie.tech`,
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await loadPost(params.slug);

  if (!post) {
    redirect("/");
  }

  addViewCount(params.slug);

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
      {/* <Head title={`${post.title} | joeymckenzie.tech`}>
        <meta name="keywords" content={post.keywords} />
      </Head> */}

      <div className="flex flex-col justify-center">
        <article className="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md">
          <h1 className="text-center text-2xl">{post.title}</h1>
          <div className="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
            <time dateTime={post.pubDate}>{formattedDate}</time>
            <Badge>{post.category}</Badge>
            <p>{post.viewCount} views</p>
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
