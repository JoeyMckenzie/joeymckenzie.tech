import React from 'react';
import { RxCode } from 'react-icons/rx';

function InlineBold({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="font-bold">{children}</span>;
}

export default function Header(): JSX.Element {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="prose mx-auto max-w-2xl lg:mx-0">
          <span className="inline-flex flex-row items-center space-x-2 text-neutral-400">
            <RxCode className="h-8 w-8 sm:h-10 sm:w-10" />
            <h2 className="font-merriweather text-3xl font-bold tracking-tight sm:text-4xl">
              Joey McKenzie
            </h2>
          </span>
          <p className="mt-6 text-sm leading-6 text-gray-300">
            Hi, I&apos;m Joey. I&apos;m a{' '}
            <InlineBold>Senior Software Engineer</InlineBold> based in Northern
            California working in FinTech. I enjoy writing about software,
            design, dad jokes, and cheap beer among a few other things.
          </p>
          <p className="mt-6 text-sm leading-6 text-gray-300">
            I like building fast and efficient web services, learning new
            things, and writing code in the open source ecosystem. If you&apos;d
            like to get in touch, feel free to reach on on any of my socials.
          </p>
        </div>
      </div>
    </div>
  );
}
