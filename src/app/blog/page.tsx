import { BlogCard } from '@/components/blog-card';
import { Post, allPosts } from 'contentlayer/generated';
import { compareDesc, format, parseISO } from 'date-fns';
import Link from 'next/link';

function PostCard(post: Post) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={post.url}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {post.title}
        </Link>
      </h2>
      <time
        dateTime={post.pubDate}
        className="mb-2 block text-xs text-gray-600"
      >
        {format(parseISO(post.pubDate), 'LLLL d, yyyy')}
      </time>
      <div
        className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </div>
  );
}

export default function Blog() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.pubDate), new Date(b.pubDate)),
  );

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-4xl font-bold tracking-tight">Blog.</h2>
        <p className="mt-6 text-sm leading-8 text-neutral-400">
          I write about a lot of things, mainly languages, ecoystems, and
          software design. I consider my writing a journal of technologies
          I&apos;ve worked with at some point during my career, and I&apos;m
          always happy to field questions and conversations from interested
          readers. Feel free to contact me about any of the writing I do here,
          or to simply say hello!
        </p>
      </div>{' '}
      <div className="mx-auto max-w-xl py-8">
        <h1 className="mb-8 text-center text-2xl font-black">
          Next.js + Contentlayer Example
        </h1>
        {posts.map((post, idx) => (
          <BlogCard key={idx} {...post} />
        ))}
      </div>
    </>
  );
}
