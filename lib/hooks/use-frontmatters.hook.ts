import { useEffect } from 'react';
import frontMatters from '@/public/frontmatters.json';
import useSWR from 'swr';
import { useBlogSearchContext } from '../contexts/blog-search.context';
import { getProjectRepos } from '../services/github.service';
import { GitHubMeta } from '../types/github.types';

export function useFrontMatters() {
  const { dispatch } = useBlogSearchContext();
  const { data: githubMetas } = useSWR<GitHubMeta[]>(
    'githubMetas',
    getProjectRepos,
    {
      revalidateIfStale: false,
    }
  );

  useEffect(
    () =>
      dispatch({
        type: 'SET_FRONTMATTERS',
        payload: frontMatters.frontMatters,
      }),
    [dispatch]
  );

  return { githubMetas };
}
