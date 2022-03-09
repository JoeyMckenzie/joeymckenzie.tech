import { FC } from 'react';
import { NextSeo } from 'next-seo';
import { useBlogLayout } from '@/lib/hooks/use-blog-layout.hook';

const BlogLayout: FC = ({ children }) => {
  const { blogTitle } = useBlogLayout();

  return (
    <>
      <NextSeo
        title={`joeymckenzie.tech - ${blogTitle}`}
        description={blogTitle}
      />
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
