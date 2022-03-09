import { useCallback, useContext, VFC } from 'react';
import {
  BlogSearchContext,
  useBlogSearchContext,
} from '@/lib/contexts/blog-search.context';
import { classNames } from '@/lib/utilities';
import { PILL_COLORS } from '@/lib/constants';

const BlogCardFilteredDomainPills: VFC = () => {
  const { filteredDomains, setFilteredDomains } = useBlogSearchContext();

  const removeDomain = useCallback(
    (paintedIndex: number) =>
      setFilteredDomains(
        filteredDomains.filter((_, index) => index !== paintedIndex)
      ),
    [filteredDomains, setFilteredDomains]
  );

  return (
    <div className="flex items-center justify-center space-x-1 pt-4">
      {filteredDomains.map((domain, index) => (
        <span
          key={index}
          onClick={() => removeDomain(index)}
          className={classNames(
            PILL_COLORS[index].pill,
            'inline-flex cursor-pointer items-center rounded-full py-0.5 pl-2.5 pr-1 text-sm font-medium'
          )}
        >
          {domain}
          <button
            type="button"
            className={classNames(
              PILL_COLORS[index].closeButton,
              'ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full focus:text-stone-500 focus:outline-none'
            )}
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
  );
};

export default BlogCardFilteredDomainPills;
