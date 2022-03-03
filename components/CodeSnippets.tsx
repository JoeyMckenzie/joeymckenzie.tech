import { VFC } from 'react';
import CodeSnippetCard from '@/components/CodeSnippetCard';
import Link from 'next/link';
import {
  SiTypescript,
  SiAngular,
  SiReact,
  SiDotnet,
  SiCsharp,
  SiGoland,
} from 'react-icons/si';

interface CodeSnippet {
  description: string;
  link: string;
  title: string;
  icons: JSX.Element[];
}

const snippets: CodeSnippet[] = [
  {
    title: 'Tailwind dark mode hook',
    description:
      'Custom React hook to utilize Tailwind dark mode document binding',
    link: '/snippets/use-tailwind-dark-mode',
    icons: [
      <SiTypescript key={0} className="h-6 w-6 text-white" />,
      <SiReact key={1} className="h-6 w-6 text-white" />,
    ],
  },
  {
    title: 'Typed next.js ActiveLink component',
    description: 'A wrapping component around next.js Link using TypeScript',
    link: '/snippets/nextjs-typescript-active-link',
    icons: [
      <SiTypescript key={0} className="h-6 w-6 text-white" />,
      <SiReact key={1} className="h-6 w-6 text-white" />,
    ],
  },
  {
    title: 'Tailwind classNames React utility',
    description:
      'A simple utility to concatenate conditional classes for Tailwind-based React apps',
    link: '/snippets/react-tailwind-classnames',
    icons: [
      <SiTypescript key={0} className="h-6 w-6 text-white" />,
      <SiReact key={1} className="h-6 w-6 text-white" />,
    ],
  },
  {
    title: 'Angular unsubscribe$ service',
    description:
      'A simple utility service to assist with closing observable streams within components',
    link: '/snippets/angular-unsubscribe-service',
    icons: [<SiAngular key={1} className="h-6 w-6 text-white" />],
  },
  {
    title: 'Fluent Validation/MediatR validator pipeline',
    description:
      'MediatR Pipeline behavior to assist in validating incoming requests with Fluent Validation',
    link: '/snippets/mediatr-request-validation',
    icons: [
      <SiCsharp key={0} className="h-6 w-6 text-white" />,
      <SiDotnet key={1} className="h-6 w-6 text-white" />,
    ],
  },
  {
    title: 'Go Atlas DDL schema file merging',
    description: 'File merging utility for partial schema definition files',
    link: '/snippets/go-atlas-ddl-file-merge',
    icons: [<SiGoland key={1} className="h-6 w-6 text-white" />],
  },
];

const CodeSnippets: VFC = () => {
  return (
    <div className="relative pb-16 lg:pb-24">
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
            {snippets.map(({ title, description, link, icons }, index) => (
              <Link href={link} key={index} passHref>
                <a>
                  <CodeSnippetCard
                    title={title}
                    description={description}
                    icons={icons}
                  />
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
