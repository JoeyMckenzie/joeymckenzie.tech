import { useContext, useEffect } from 'react';
import frontMatters from '@/public/frontmatters.json';
import useSWR from 'swr';
import {
  BlogSearchContext,
  useBlogSearchContext,
} from '../contexts/blog-search.context';
import { getProjectRepos } from '../services/github.service';
import { GitHubMeta } from '../types/github.types';

export function useFrontMatters() {
  const { setFrontMatters } = useBlogSearchContext();
  const { data: githubMetas } = useSWR<GitHubMeta[]>(
    'githubMetas',
    getProjectRepos,
    {
      revalidateIfStale: false,
    }
  );

  useEffect(
    () => setFrontMatters(frontMatters.frontMatters),
    [setFrontMatters]
  );

  return { githubMetas };
}
