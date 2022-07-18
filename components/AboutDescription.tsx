import { VFC } from 'react';

const AboutDescription: VFC = () => (
  <div className="space-y-6 lg:col-span-2 lg:col-start-1">
    {/* Description list*/}
    <section aria-labelledby="applicant-information-title">
      <div className="bg-white text-center shadow dark:bg-stone-800 sm:rounded-lg sm:text-left">
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
                .NET, TypeScript, Go, Rust, container orchestratrion, working
                with Postgres databases, anything that has to do with modern web
                development
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Could do without
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                Go web frameworks, throwing exceptions, implicit typing with{' '}
                <code lang="javascript">any</code>, working with Oracle
                databases, anything that has to do with Java
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Favorite beers
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                Hexagenia by Fall River Brewery, Apocalypse IPA by 10 Barrel
                Brewing Co., anything that&apos;s cold on a hot summer day
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Unpopular opinion
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                WSL2 is the best development environment (I&apos;m a{' '}
                <a
                  className="text-indigo-500"
                  href="https://www.debian.org/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Debian
                </a>{' '}
                guy myself)
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Words of wisdom
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                Write code your fellow developers love to read
              </dd>
            </div>
            <div className="text-center sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                About
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                I like building things. I write software for a living as a
                professional Software Developer, amateur scrum master, part-time
                DBA, impromptu DevOps Engineer, a sifter of Kibana logs, and
                connoisseur of cheap beer among other things. I like to write
                about things in code that mostly have to do with and
                microservice development, while also adventuring into a wide
                variety of technology stacks to blog about. I work at a fintech
                company currently as a .NET developer, but I dabble in just
                about everything the modern web and application frameworks have
                to offer.
              </dd>
              <dd className="mt-2 text-sm text-gray-900 dark:text-gray-300">
                When I&apos;m not sitting in front of an IDE or breaking
                production environments, you&apos;ll find me spending time with
                my wife and dog, hanging out with friends and family, or
                probably sitting at the bar of one of my town&apos;s local
                breweries.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
);

export default AboutDescription;
