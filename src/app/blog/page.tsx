import { BlogPreview } from '@/components/blog-preview';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

const posts = allPosts.sort((a, b) =>
  compareDesc(new Date(a.pubDate), new Date(b.pubDate)),
);

export default function Blog() {
  return (
    <>
      <div className="pb-12">
        <h2 className="text-center text-4xl font-bold tracking-tight">Blog.</h2>
        <p className="prose mx-auto mt-6 text-justify text-neutral-400">
          I write about a lot of things, mainly languages, ecoystems, and
          software design. I consider my writing a journal of technologies
          I&apos;ve worked with at some point during my career, and I&apos;m
          always happy to field questions and conversations from interested
          readers. Feel free to contact me about any of the writing I do here,
          or to simply say hello!
        </p>
      </div>
      <BlogPreview posts={posts} />
    </>
  );
}
