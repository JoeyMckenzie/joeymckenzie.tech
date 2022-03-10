import { useCallback } from 'react';
import useSWR from 'swr';
import { useBlogSearchContext } from '../contexts/blog-search.context';
import { getBlogViews, addViewToBlog } from '../services/views.service';

export function useBlogCard(apiLink: string) {
  const { state, dispatch } = useBlogSearchContext();
  const { data: blogViews } = useSWR<number>(apiLink, getBlogViews, {
    revalidateIfStale: false,
  });

  const addDomain = useCallback(
    (domain: string) => {
      if (state.previewMode) {
        return;
      }

      dispatch({
        type: 'SET_SEARCH_TEXT',
        payload: '',
      });

      if (!state.filteredDomains.find((d) => d === domain)) {
        dispatch({
          type: 'SET_FILTERED_DOMAINS',
          payload: [...state.filteredDomains, domain],
        });
      }
    },
    [dispatch, state.filteredDomains, state.previewMode]
  );

  const addBlogView = useCallback(async () => {
    if (process.env.NODE_ENV === 'production') {
      await addViewToBlog(`${apiLink}/new`, blogViews ?? 0);
    }
  }, [apiLink, blogViews]);

  return {
    addDomain,
    addBlogView,
    blogViews,
  };
}
