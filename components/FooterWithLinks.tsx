import { SOCIALS } from '@/lib/constants';
import { VFC } from 'react';
import ActiveLink from '@/components/ActiveLink';
import Logo from '@/components/Logo';
import { SiNextdotjs, SiVercel } from 'react-icons/si';
import SocialsIcons from './SocialsIcons';

const FooterWithLinks: VFC = () => (
  <footer className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
    <nav
      className="-mx-5 -my-2 flex flex-wrap justify-center"
      aria-label="Footer"
    >
      {SOCIALS.main.map((item) => (
        <div key={item.name} className="px-5 py-2">
          <ActiveLink
            href={item.href}
            className="font-ubuntu text-base transition duration-150 ease-in-out"
            defaultClassName="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            activeClassName="text-gray-900 dark:text-gray-200"
          >
            {item.name}
          </ActiveLink>
        </div>
      ))}
    </nav>
    <SocialsIcons containerClassName="mt-8 flex justify-center space-x-6" />
    <div className="flex flex-col items-center justify-center gap-x-2 gap-y-2 pt-6 sm:flex-row sm:gap-y-0 md:order-1 md:mt-0">
      <Logo />
      <p className="text-center text-base text-gray-400">powered by</p>
      <div className="flex flex-row space-x-2">
        <a
          href="https://nextjs.org"
          rel="noreferrer noopener"
          target="_blank"
          className="transform transition duration-150 ease-in-out hover:scale-110"
        >
          <SiNextdotjs className="h-6 w-6 dark:text-stone-300" />
        </a>
        <a
          href="https://vercel.com"
          rel="noreferrer noopener"
          target="_blank"
          className="transform transition duration-150 ease-in-out hover:scale-110"
        >
          <SiVercel className="h-6 w-6 dark:text-stone-300" />
        </a>
      </div>
    </div>
    {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ? (
      <span className="flex justify-center pt-4 text-sm text-gray-600">
        version:{' '}
        {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.slice(0, 7) ?? ''}
      </span>
    ) : null}
  </footer>
);

export default FooterWithLinks;
