import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
  VFC,
} from 'react';
import blogs from '@/public/frontmatters.json';
import BlogCard from '@/components/BlogCard';
import { classNames } from '@/lib/utilities/class-names';
import { PILL_COLORS } from '@/lib/utilities/constants';
import { FrontMatter } from '@/lib/types';

const BlogContainer: VFC = () => {
  const { frontMatters } = blogs;

  const [domains, setDomains] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredFrontMatters, setFilteredFrontMatters] =
    useState(frontMatters);

  const onSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const searchTextValue = e.target.value.toLocaleLowerCase();

      const matchingFrontMatters =
        searchTextValue.length === 0
          ? frontMatters
          : frontMatters.filter(
              (fm) => fm.title.toLocaleLowerCase().indexOf(searchTextValue) > -1
            );

      if (matchingFrontMatters.length > 0 && domains.length > 0) {
        setDomains([]);
      }

      setFilteredFrontMatters(matchingFrontMatters);
      setSearchText(searchTextValue);
    },
    [frontMatters, domains, setFilteredFrontMatters, setSearchText, setDomains]
  );

  const sortFrontMatters = (previous: FrontMatter, current: FrontMatter) => {
    const previousDate = new Date(previous.datetime);
    const currentDate = new Date(current.datetime);

    if (currentDate > previousDate) {
      return 1;
    } else if (currentDate < previousDate) {
      return -1;
    }

    return 0;
  };

  useEffect(() => {
    setFilteredFrontMatters(
      frontMatters.filter((fm) =>
        domains.every((d) => fm.domains.indexOf(d) > -1)
      )
    );
  }, [domains, frontMatters, setFilteredFrontMatters]);

  const removeDomain = useCallback(
    (paintedIndex: number) =>
      setDomains(domains.filter((_, index) => index !== paintedIndex)),
    [domains, setDomains]
  );

  const onDomainAdded = useCallback(
    (domain: string) => {
      setSearchText('');
      if (!domains.find((d) => d === domain)) {
        setDomains([...domains, domain]);
      }
    },
    [domains, setDomains, setSearchText]
  );

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="relative mx-auto max-w-lg lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
            Blog
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 sm:mt-4">
            I write about a lot of things, mostly .NET and web development in
            general these days. The world of software is big, and there&apos;s
            no lack of topics for me to ramble on about. Grab a cold beverage of
            your choice, sit back, and have a look into the things that keep me
            up at night (mostly null references).
          </p>
        </div>

        <div className="mx-auto max-w-lg pt-8">
          <input
            type="text"
            name="blog-search"
            id="blog-search"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Looking for a blog?"
            value={searchText}
            onChange={onSearch}
          />
        </div>

        <div className="flex items-center justify-center space-x-1 pt-4">
          {domains.map((domain, index) => (
            <span
              key={index}
              onClick={() => removeDomain(index)}
              className={classNames(
                PILL_COLORS[index].pill,
                PILL_COLORS[index].closeButton,
                'inline-flex cursor-pointer items-center rounded-full py-0.5 pl-2.5 pr-1 text-sm font-medium'
              )}
            >
              {domain}
              <button
                type="button"
                className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full focus:text-stone-500 focus:outline-none"
              >
                <span className="sr-only">Remove large option</span>
                <svg
                  className="h-2 w-2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-16 pt-6 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {filteredFrontMatters.sort(sortFrontMatters).map((frontMatter) => (
            <BlogCard
              key={frontMatter.title}
              post={frontMatter}
              onDomainAdded={onDomainAdded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogContainer;
