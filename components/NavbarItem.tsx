import { VFC } from 'react';
import { NavigationItem } from 'lib/types/navigation.types';
import { classNames } from '@/lib/utilities/class-names';

const NavbarItem: VFC<NavigationItem> = ({ name, href, current }) => (
  <a
    href={href}
    className={classNames(
      current
        ? 'bg-gray-900 text-white'
        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-700 hover:text-white',
      'px-3 py-2 rounded-md text-sm font-medium'
    )}
    aria-current={current ? 'page' : undefined}
  >
    {name}
  </a>
);

export default NavbarItem;
