import { ChangeEventHandler, useCallback, useContext } from 'react';
import {
  BlogSearchContext,
  useBlogSearchContext,
} from '../contexts/blog-search.context';

export function useBlogSearchInput() {
  const {
    searchText,
    setSearchText,
    frontMatters,
    setFilteredFrontMatters,
    setFilteredDomains,
    filteredDomains,
  } = useBlogSearchContext();

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

  return {
    onSearch,
    searchText,
  };
}
