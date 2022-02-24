/* This example requires Tailwind CSS v2.0+ */
import { VFC } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

const NotFound: VFC = () => {
  return (
    <div className="flex min-h-full flex-col pt-24 pb-12">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <Logo />
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-gray-300">
              Four... oh, four.
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-5xl">
              Page not found.
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Sorry, that page does&apos;t exist.
            </p>
            <div className="mt-6">
              <Link href="/" passHref>
                <a className="text-base font-medium text-indigo-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-gray-500">
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
