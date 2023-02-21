import ActiveLink from './+ActiveLink';
import { FiTerminal } from 'react-icons/fi';
import Link from 'next/link';

type NavigationLink = {
  display: string;
  href: string;
};

const navigationLinks: NavigationLink[] = [
  {
    display: 'home',
    href: '/',
  },
  {
    display: 'about',
    href: '/about',
  },
  {
    display: 'blog',
    href: '/blog',
  },
];

export default function Navbar(): JSX.Element {
  return (
    <nav className="mt-4 flex flex-row items-center gap-x-2 px-6">
      <Link href="/" className="pr-4">
        <FiTerminal className="h-6 w-6 text-neutral-400" />
      </Link>
      {navigationLinks.map(({ href, display }, index) => (
        <ActiveLink
          key={`link-${index}`}
          href={href}
          className="inline-flex px-2 py-1 font-merriweather font-medium text-neutral-400"
          activeClassName="rounded border border-transparent bg-neutral-800 text-neutral-300 hover:bg-neutral-500 focus:outline-none"
        >
          {display}
        </ActiveLink>
      ))}
    </nav>
  );
}
