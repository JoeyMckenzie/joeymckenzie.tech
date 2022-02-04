import { Disclosure } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import { VFC } from 'react';
import NavbarItem from './internal/NavbarItem';
import ProfileImage from './internal/ProfileImage';
import NavbarToggleButton from './internal/NavbarToggleButton';
import { navigation } from './internal/navigation.constants';

export const Navbar: VFC = () => (
  <Disclosure as="nav" className="bg-gray-800">
    {({ open }) => (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <NavbarItem
                      key={item.name}
                      name={item.name}
                      href={item.href}
                      current={item.current}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <ProfileImage />
              </div>
            </div>

            <NavbarToggleButton open={open} />
          </div>
        </div>
      </>
    )}
  </Disclosure>
);
