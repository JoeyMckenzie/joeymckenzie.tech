import { Disclosure } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import { classNames } from '@lib';
import { VFC } from 'react';
import { navigation, user, userNavigation } from './navigation.constants';

const MobileMenu: VFC = () => (
  <Disclosure.Panel className="md:hidden">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      {navigation.map((item) => (
        <Disclosure.Button
          key={item.name}
          as="a"
          href={item.href}
          className={classNames(
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name}
        </Disclosure.Button>
      ))}
    </div>
    <div className="pt-4 pb-3 border-t border-gray-700">
      <div className="flex items-center px-5">
        <div className="flex-shrink-0">
          <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
        </div>
        <div className="ml-3">
          <div className="text-base font-medium leading-none text-white">
            {user.name}
          </div>
          <div className="text-sm font-medium leading-none text-gray-400">
            {user.email}
          </div>
        </div>
        <button
          type="button"
          className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 px-2 space-y-1">
        {userNavigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>
    </div>
  </Disclosure.Panel>
);

export default MobileMenu;
