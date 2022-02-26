import { VFC } from 'react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

const Navbar: VFC = () => (
  <nav className="fixed top-0 z-10 w-full bg-opacity-50 shadow backdrop-blur backdrop-filter">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 justify-between">
        <div className="flex">
          <div className="flex flex-shrink-0 items-center">
            <Logo />
          </div>
        </div>
        {/*Don't think I need this yet*/}
        {/*<div className="-ml-16 hidden flex-row items-center space-x-4 font-ubuntu sm:flex">
          <ActiveLink
            className=""
            activeClassName="text-gray-900 dark:text-gray-200"
            defaultClassName="text-gray-600 dark:text-gray-500"
            href="/blog"
          >
            Blog
          </ActiveLink>
          <a className="text-gray-600 dark:text-gray-500">Snippets</a>
          <a className="text-gray-600 dark:text-gray-500">Contact</a>
        </div>*/}
        <div className="flex items-center sm:ml-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
