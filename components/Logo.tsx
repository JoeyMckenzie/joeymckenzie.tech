import { useCallback, VFC } from 'react';
import Link from 'next/link';

const Logo: VFC = () => (
  <Link href="/" passHref>
    <a className="flex cursor-pointer flex-row space-x-2">
      <svg
        className="h-6 w-6 text-stone-900 dark:text-stone-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="font-ubuntu text-stone-900 dark:text-stone-200">
        joeymckenzie.tech
      </p>
    </a>
  </Link>
);

export default Logo;
