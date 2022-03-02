import { VFC } from 'react';

const AboutHero: VFC = () => (
  <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
    <div className="text-center">
      <div className="flex flex-row items-baseline justify-center text-gray-900 dark:text-gray-200">
        <p className="pt-4 text-3xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
          De &middot; vel &middot; op &middot; er
        </p>
        <p className="ml-4 sm:text-xl">[noun]</p>
      </div>
      <p className="mx-auto mt-5 max-w-xl text-gray-600 line-through dark:text-gray-400">
        <span className="font-extrabold">a</span>. a chemical used to develop
        exposed photographic materials
      </p>
      <p className="mx-auto max-w-xl text-gray-600 line-through dark:text-gray-400">
        <span className="font- font-extrabold">b</span>. a person who develops
        real estate
      </p>
      <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-400">
        <span className="font-extrabold">c</span>. a person or company that
        develops computer software
      </p>
    </div>
  </div>
);

export default AboutHero;
