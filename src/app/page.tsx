import { BlogPreview } from '@/components/blog-preview';
import { SocialsButtons } from '@/components/socials-buttons';
import { db } from '@/lib/db';
import { viewCounts } from '@/lib/schema';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { desc } from 'drizzle-orm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hi, I'm Joe. | joeymckenzie.tech",
  description: 'A blog about software, technology, and sometimes beer.',
};

const posts = allPosts
  .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)))
  .slice(0, 3);

export default async function Home() {
  const viewCountsQuery = await db
    .select({
      slug: viewCounts.slug,
      count: viewCounts.viewCount,
    })
    .from(viewCounts)
    .orderBy(desc(viewCounts.viewCount));

  console.log(viewCountsQuery);

  return (
    <>
      <h2 className="text-center text-4xl font-bold tracking-tight">
        Hi, I&apos;m Joey.
      </h2>
      <p className="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
        Hi, I&apos;m Joey. I&apos;m a{' '}
        <span className="font-semibold">Senior Software Engineer</span> based in
        Northern California working in fintech. I enjoy writing about software,
        design, dad jokes, and cheap beer among a few other things. I like
        building fast and efficient web services, learning new things, and
        writing code in the open source ecosystem. If you&apos;d like to get in
        touch, feel free to reach on on any of my socials.
      </p>
      <SocialsButtons />
      <BlogPreview posts={posts} />
    </>
  );
}
