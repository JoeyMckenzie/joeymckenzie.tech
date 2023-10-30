import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) {
    throw new Error(`Post not found for slug: ${params.slug}`);
  }

  return { title: post.title };
};

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) {
    throw new Error(`Post not found for slug: ${params.slug}`);
  }

  return (
    <>
      <article className="prose mx-auto overflow-hidden pb-6 text-justify dark:prose-invert prose-img:mx-auto prose-img:rounded-md">
        <h1 className="text-center text-2xl">{post.title}</h1>
        <div className="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight">
          <time dateTime={new Date(post.pubDate).toISOString()}>
            {new Date(post.pubDate).toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <Badge>{post.category}</Badge>
        </div>
        {/* <Image
          width="540"
          height="280"
          src={post.heroImage}
          alt="Blog header image"
        /> */}
        <div
          dangerouslySetInnerHTML={{
            __html: post.body.html,
          }}
        />
      </article>
      <Button asChild>
        <Link href="/blog">Back to blogs</Link>
      </Button>
    </>
  );
}
