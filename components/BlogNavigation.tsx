import { FC } from 'react';
import Link from 'next/link';

interface BlogNavigationProps {
  display: string;
  smallDisplay: string;
  slug: string;
}

const BlogNavigation: FC<BlogNavigationProps> = ({
  children,
  display,
  smallDisplay,
  slug,
}) => (
  <Link href={`/blog/${slug}`} passHref>
    <a className="flex flex-row items-center justify-center gap-x-2 text-left text-indigo-500 hover:text-indigo-400 dark:text-indigo-200 dark:hover:text-indigo-100">
      {children}
      <span className="hidden sm:block">{display}</span>
      <span className="block sm:hidden">{smallDisplay}</span>
    </a>
  </Link>
);

export default BlogNavigation;
