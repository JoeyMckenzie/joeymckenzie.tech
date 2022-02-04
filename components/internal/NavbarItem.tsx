import { classNames } from '@lib';
import { VFC } from 'react';
import { NavigationItem } from 'types/navigation.types';

const NavbarItem: VFC<NavigationItem> = ({ name, href, current }) => (
  <a
    href={href}
    className={classNames(
      current
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
      'px-3 py-2 rounded-md text-sm font-medium'
    )}
    aria-current={current ? 'page' : undefined}
  >
    {name}
  </a>
);

export default NavbarItem;
