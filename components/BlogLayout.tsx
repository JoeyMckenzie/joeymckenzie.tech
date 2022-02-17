import { FC, useEffect, useState } from 'react';
import hljs from 'highlight.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import blogs from '@/public/frontmatters.json';
import { sortFrontMatters } from '@/lib/utilities';
import { FrontMatter } from '@/lib/types';
import Head from 'next/head';

const BlogLayout: FC = ({ children }) => {
  const { frontMatters } = blogs;

  const { route } = useRouter();
  const [currentBlogTitle, setCurrentBlogTitle] = useState('');
  const [nextBlog, setNextBlog] = useState<FrontMatter>();
  const [previousBlog, setPreviousBlog] = useState<FrontMatter>();

  useEffect(() => {
    const currentFrontMatterIndex = frontMatters
      .sort(sortFrontMatters)
      .findIndex((fm: FrontMatter) => fm.slug === route.split('/')[2]);

    let nextFrontMatter: FrontMatter | undefined =
      frontMatters[currentFrontMatterIndex + 1];
    let previousFrontMatter: FrontMatter | undefined =
      frontMatters[currentFrontMatterIndex - 1];

    if (!nextFrontMatter) {
      nextFrontMatter = frontMatters[0];
    }

    if (!previousFrontMatter) {
      previousFrontMatter = frontMatters[frontMatters.length - 1];
    }

    setCurrentBlogTitle(frontMatters[currentFrontMatterIndex].title);
    setNextBlog(nextFrontMatter);
    setPreviousBlog(previousFrontMatter);
    hljs.highlightAll();
  }, [route, frontMatters, setNextBlog, setPreviousBlog, setCurrentBlogTitle]);

  return (
    <>
      <Head>
        <title>joeymckenzie.tech &middot; {currentBlogTitle}</title>
      </Head>
      <div className="relative my-24 overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-prose text-lg">
            <div className="prose prose-lg prose-stone mx-auto mt-6 text-gray-500 prose-h1:text-center prose-img:mx-auto prose-img:rounded-sm prose-img:object-center dark:prose-invert dark:text-gray-300">
              {children}
            </div>
            <div className="mx-auto flex max-w-4xl flex-row items-center justify-between px-4 pt-6">
              <Link href={`/blog/${nextBlog?.slug}`} passHref>
                <a className="flex flex-row items-center justify-center gap-x-2 text-left text-indigo-500 hover:text-indigo-400 dark:text-indigo-200 dark:hover:text-indigo-100">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                  </svg>
                  <span className="hidden sm:block">{nextBlog?.title}</span>
                  <span className="block sm:hidden">Next</span>
                </a>
              </Link>

              <Link href={`/blog/${previousBlog?.slug}`} passHref>
                <a className="flex flex-row items-center justify-center gap-x-2 text-right text-indigo-500 hover:text-indigo-400 dark:text-indigo-200 dark:hover:text-indigo-100">
                  <span className="hidden sm:block">{previousBlog?.title}</span>
                  <span className="block sm:hidden">Previous</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogLayout;
