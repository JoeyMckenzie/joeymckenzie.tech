import { VFC } from 'react';

const BlogHeader: VFC = () => (
  <div className="text-center">
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
      Blog
    </h2>
    <p className="mt-3 text-gray-500 dark:text-gray-400 sm:mt-4">
      I write about a lot of things, mostly .NET and web development in general
      these days. The world of software is big, and there&apos;s no lack of
      topics for me to ramble on about. Grab your cold beverage of choice, sit
      back, and have a look into the things that keep me up at night (mostly
      null references).
    </p>
  </div>
);

export default BlogHeader;
