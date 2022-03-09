import { useCallback } from 'react';
import useSWR from 'swr';
import { useBlogSearchContext } from '../contexts/blog-search.context';
import { getBlogViews, addViewToBlog } from '../services/views.service';

export function useBlogCard(apiLink: string) {
  const { data: blogViews } = useSWR<number>(apiLink, getBlogViews, {
    revalidateIfStale: false,
  });

  const { filteredDomains, setSearchText, setFilteredDomains, previewMode } =
    useBlogSearchContext();

  const addDomain = useCallback(
    (domain: string) => {
      if (previewMode) {
        return;
      }

      setSearchText('');
      if (!filteredDomains.find((d) => d === domain)) {
        setFilteredDomains([...filteredDomains, domain]);
      }
    },
    [previewMode, filteredDomains, setFilteredDomains, setSearchText]
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
