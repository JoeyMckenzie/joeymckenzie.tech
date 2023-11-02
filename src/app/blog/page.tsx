import { BlogPreview } from '@/components/blog-preview';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

const posts = allPosts
  .filter((p) => p.published)
  .sort((a, b) => compareDesc(new Date(a.pubDate), new Date(b.pubDate)));

export default async function Blog() {
  return (
    <>
      <div className="pb-12">
        <h2 className="text-center text-4xl font-bold tracking-tight">Blog.</h2>
        <p className="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
          I write about a lot of things, mainly languages, ecoystems, and
          software design. I consider my writing a journal of technologies
          I&apos;ve worked with at some point during my career, and I&apos;m
          always happy to field questions and conversations from interested
          readers. Feel free to{' '}
          <a href="mailto:joey.mckenzie27@gmail.com">contact</a> me about any of
          the writing I do here, or to simply say hello!
        </p>
      </div>
      <BlogPreview posts={posts} />
    </>
  );
}
