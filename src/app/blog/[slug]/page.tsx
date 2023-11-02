import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { addViewCount } from '@/lib/db';
import { allPosts } from 'contentlayer/generated';
import Image from 'next/image';
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

  await addViewCount(params.slug);

  return (
    <div className="flex flex-col justify-center">
      <article className="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-img:mx-auto prose-img:rounded-md">
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
        <Image
          width="540"
          height="280"
          src={post.heroImage}
          alt="Blog header image"
        />
        <div
          dangerouslySetInnerHTML={{
            __html: post.body.html,
          }}
        />
      </article>
      <Button className="mx-auto max-w-md" asChild>
        <Link href="/blog">Back to blogs</Link>
      </Button>
    </div>
  );
}
