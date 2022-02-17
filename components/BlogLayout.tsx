import { FC } from 'react';

const BlogLayout: FC = ({ children }) => (
  <div className="relative my-24 overflow-hidden">
    <div className="relative px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-prose text-lg">
        <div className="prose prose-lg prose-indigo mx-auto mt-6 text-gray-500 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  </div>
);
