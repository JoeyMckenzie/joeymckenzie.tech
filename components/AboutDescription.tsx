import { VFC } from 'react';

const AboutDescription: VFC = () => (
  <div className="space-y-6 lg:col-span-2 lg:col-start-1">
    {/* Description list*/}
    <section aria-labelledby="applicant-information-title">
      <div className="bg-white shadow dark:bg-stone-800 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="applicant-information-title"
            className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
          >
            Summary
          </h2>
          {/*<p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Technologies I use day-to-day, ecosystems I enjoy
          </p>*/}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 dark:border-stone-700 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current job title
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                Software Engineer at National Funding, a fintech company located
                in San Diego specializing in .NET development
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Prefers
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                .NET, Go, TypeScript, Tailwind, working with Postgres databases,
                anything that has to do with modern web development
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Could do without
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                Go web frameworks, implicitly typing with{' '}
                <code lang="javascript">any</code>, working with Oracle
                databases, anything that has to do with Java
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Favorite Beer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                Hexagenia IPA by Fall River Brewery
              </dd>
            </div>
            <div className="text-center sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                About
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                I like building things. I write software for a living as a
                professional software engineer, amateur scrum master, part-time
                DBA, pipeline build failure fixer, restart-er of production
                servers, and connoisseur of cheap beer. I like to write about
                things in code that mostly have to do with .NET and web
                development, while also adventuring into a wide variety of
                technology stacks to blog about. I work at a SaaS company
                currently writing lots of C#, .NET, and Vue, but I dabble in
                just about everything the modern web and application frameworks
                have to offer.
              </dd>
              <dd className="mt-2 text-sm text-gray-900 dark:text-gray-300">
                When I&apos;m not sitting in front of an IDE or breaking
                production environments, you&apos;ll find spending time with my
                wife and dog, hanging out with friends, or probably sitting at
                the bar of one of my town&apos;s local breweries.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
);

export default AboutDescription;
