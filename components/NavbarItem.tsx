import { VFC } from 'react';
import { NavigationItem } from 'lib/types/navigation.types';
import { classNames } from '@/lib/utilities/class-names';

const NavbarItem: VFC<NavigationItem> = ({ name, href, current }) => (
  <a
    href={href}
    className={classNames(
      current
        ? 'bg-gray-900 text-white'
        : 'text-gray-500 hover:bg-gray-700 hover:text-white dark:text-gray-300',
      'rounded-md px-3 py-2 text-sm font-medium'
    )}
    aria-current={current ? 'page' : undefined}
  >
    {name}
  </a>
);

export default NavbarItem;
