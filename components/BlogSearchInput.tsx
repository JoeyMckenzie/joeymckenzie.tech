import { ChangeEventHandler, useCallback, useContext, VFC } from 'react';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';

const BlogSearchInput: VFC = () => {
  const {
    searchText,
    setSearchText,
    frontMatters,
    setFilteredFrontMatters,
    setFilteredDomains,
    filteredDomains,
  } = useContext(BlogSearchContext);

  const onSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const searchTextValue = e.target.value.toLocaleLowerCase();

      const matchingFrontMatters =
        searchTextValue.length === 0
          ? frontMatters
          : frontMatters.filter(
              (fm) => fm.title.toLocaleLowerCase().indexOf(searchTextValue) > -1
            );

      if (matchingFrontMatters.length > 0 && filteredDomains.length > 0) {
        setFilteredDomains([]);
      }

      setFilteredFrontMatters(matchingFrontMatters);
      setSearchText(searchTextValue);
    },
    [
      frontMatters,
      filteredDomains,
      setFilteredFrontMatters,
      setSearchText,
      setFilteredDomains,
    ]
  );

  return (
    <div className="mx-auto max-w-lg pt-8">
      <input
        type="text"
        name="blog-search"
        id="blog-search"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 dark:focus:border-stone-700 dark:focus:ring-stone-700 sm:text-sm"
        placeholder="Looking for a blog?"
        value={searchText}
        onChange={onSearch}
      />
    </div>
  );
};

export default BlogSearchInput;
