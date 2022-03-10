import { ChangeEventHandler, useCallback } from 'react';
import { useBlogSearchContext } from '../contexts/blog-search.context';

export function useBlogSearchInput() {
  const { state, dispatch } = useBlogSearchContext();

  const onSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const searchTextValue = e.target.value.toLocaleLowerCase();

      const matchingFrontMatters =
        searchTextValue.length === 0
          ? state.frontMatters
          : state.frontMatters.filter(
              (fm) => fm.title.toLocaleLowerCase().indexOf(searchTextValue) > -1
            );

      if (matchingFrontMatters.length > 0 && state.filteredDomains.length > 0) {
        dispatch({
          type: 'SET_FILTERED_DOMAINS',
          payload: [],
        });
      }

      dispatch({
        type: 'SET_FILTERED_FRONTMATTERS',
        payload: matchingFrontMatters,
      });

      dispatch({
        type: 'SET_SEARCH_TEXT',
        payload: searchTextValue,
      });
    },
    [dispatch, state.filteredDomains.length, state.frontMatters]
  );

  return {
    onSearch,
    searchText: state.searchText,
  };
}
