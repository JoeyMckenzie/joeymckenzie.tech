import React from 'react';

function Bold({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="font-bold">{children}</span>;
}

export default function Header(): JSX.Element {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="prose mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
            Joey McKenzie
          </h2>
          <p className="mt-6 text-sm leading-6 text-gray-300">
            Hi, I&apos;m Joey. I&apos;m a <Bold>Senior Software Engineer</Bold>{' '}
            based in Northern California working in FinTech. I enjoy writing
            about software, design, dad jokes, and cheap beer among a few other
            things.
          </p>
          <p className="mt-6 text-sm leading-6 text-gray-300">
            I like building <Bold>fast</Bold> and <Bold>efficient</Bold> web
            services, learning new things, and writing code in the open source
            ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
