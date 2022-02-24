import { VFC } from 'react';
import CodeSnippetCard from '@/components/CodeSnippetCard';
import Link from 'next/link';

interface CodeSnippet {
  description: string;
  link: string;
  title: string;
}

const snippets: CodeSnippet[] = [
  {
    title: 'Tailwind dark mode hook',
    description:
      'Custom React hook to utilize Tailwind dark mode document binding',
    link: '/snippets/use-tailwind-dark-mode',
  },
  {
    title: 'Typed next.js ActiveLink component',
    description: 'A wrapping component around next.js Link using TypeScript',
    link: '/snippets/nextjs-typescript-active-link',
  },
  {
    title: 'Tailwind classNames React utility',
    description:
      'A simple utility to concatenate conditional classes for Tailwind-based React apps',
    link: '/snippets/react-tailwind-classnames',
  },
];

const CodeSnippets: VFC = () => {
  return (
    <div className="relative">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
          Code snippets
        </p>
        <p className="mx-auto mt-5 max-w-prose text-gray-500 dark:text-gray-400">
          A collection of common code snippets I&apos;ve compiled over the years
          and use across projects of all kind. Feel free to grab a quick byte
          (pun intended)!
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {snippets.map(({ title, description, link }, index) => (
              <Link href={link} key={index} passHref>
                <a>
                  <CodeSnippetCard title={title} description={description} />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippets;
