import { NAVIGATION_LINKS } from '@/lib/constants';
import { classNames } from '@/lib/utilities';
import { VFC } from 'react';
import ActiveLink from './ActiveLink';

const HeaderButtons: VFC = () => (
  <span className="relative z-0 mx-auto inline-flex rounded-md align-middle font-ubuntu shadow-sm">
    {NAVIGATION_LINKS.map((link, index) => (
      <ActiveLink
        key={link.href}
        className={classNames(
          index === 0 ? 'rounded-l-md' : '-ml-px',
          index === NAVIGATION_LINKS.length - 1 ? 'rounded-r-md' : '',
          'relative inline-flex border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition duration-150 ease-in-out hover:bg-gray-50 focus:z-10 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-900'
        )}
        activeClassName="text-gray-900 bg-stone-100 dark:text-gray-200 dark:bg-stone-700"
        defaultClassName="text-gray-700 dark:text-gray-500"
        href={link.href}
      >
        {link.name}
      </ActiveLink>
    ))}
  </span>
);

export default HeaderButtons;
