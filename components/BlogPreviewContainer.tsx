import { VFC } from 'react';
import BlogContainerMeta from '@/components/BlogContainerMeta';
import BlogCardsContainer from '@/components/BlogCardsContainer';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const BlogPreviewContainer: VFC = () => {
  return (
    <BlogContainerMeta>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
          Latest from the blog
        </h2>
      </div>
      <BlogCardsContainer previewMode={true} />
      <div className="pt-12">
        <Link href="/blog" passHref>
          <a className="flex flex-row items-center justify-center gap-x-1 font-ubuntu text-xl text-gray-900 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-300">
            Read more
            <ArrowCircleRightIcon className="h-6 w-6 text-gray-900 dark:text-gray-200" />
          </a>
        </Link>
      </div>
    </BlogContainerMeta>
  );
};

export default BlogPreviewContainer;
