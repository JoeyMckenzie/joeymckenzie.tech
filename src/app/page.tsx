import { BlogPreview } from '@/components/blog-preview';
import { SocialsButtons } from '@/components/socials-buttons';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hi, I'm Joe. | joeymckenzie.tech",
  description: 'A blog about software, technology, and sometimes beer.',
};

const posts = allPosts
  .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)))
  .slice(0, 3);

export default function Home() {
  return (
    <>
      <h2 className="text-center text-4xl font-bold tracking-tight">
        Hi, I&apos;m Joey.
      </h2>
      <p className="prose mx-auto mt-6 text-justify text-sm leading-8 text-neutral-400">
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
