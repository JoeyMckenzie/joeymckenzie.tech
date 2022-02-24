import { FC, useContext, useEffect, useState } from 'react';
import hljs from 'highlight.js';
import { useRouter } from 'next/router';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';
import Head from 'next/head';

const BlogLayout: FC = ({ children }) => {
  const { route } = useRouter();
  const { frontMatters } = useContext(BlogSearchContext);
  const [blogTitle, setBlogTitle] = useState('');

  useEffect(() => {
    hljs.highlightAll();
    const slug = route.split('/')[2];
    const frontMatter = frontMatters.find((fm) => fm.slug === slug);
    if (frontMatter) {
      setBlogTitle(frontMatter.title);
    }
  }, [route, frontMatters, setBlogTitle]);

  return (
    <>
      <Head>
        <title>joeymckenzie.tech &middot; {blogTitle}</title>
      </Head>
      <div className="relative my-24 overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-prose text-lg">
            <div className="prose prose-stone mx-auto mt-6 text-gray-600 prose-h1:text-center prose-img:mx-auto prose-img:rounded-sm prose-img:object-center dark:prose-invert dark:text-gray-300">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogLayout;
