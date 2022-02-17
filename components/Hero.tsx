import { VFC } from 'react';

const Hero: VFC = () => (
  <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
    <div className="text-center">
      <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-gray-200 sm:text-5xl sm:tracking-tight lg:text-6xl">
        Hi, I&apos;m Joey
      </p>
      <div className="prose mx-auto mt-5 max-w-xl text-gray-500 dark:text-gray-400">
        <p>
          I like building things. I write software for a living as a
          professional software engineer, amateur scrum master, part-time DBA,
          pipeline build failure fixer, restart-er of production servers, and
          connoisseur of cheap beer. I like to write about things in code that
          mostly have to do with .NET and web development, while also
          adventuring into a wide variety of technology stacks to blog about. I
          work at a SaaS company currently writing lots of C#, .NET, and Vue,
          but I dabble in just about everything the modern web and application
          frameworks have to offer.
        </p>
        <p>
          When I&apos;m not sitting in front of an IDE or breaking production
          environments, you&apos;ll find spending time with my wife and dog,
          hanging out with friends, or probably sitting at the bar of one of my
          town&apos;s local breweries.
        </p>
      </div>
    </div>
  </div>
);

export default Hero;
