import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import frontMatters from '@/public/frontmatters.json';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';
import CodeSnippets from '@/components/CodeSnippets';
import BlogPreviewContainer from '@/components/BlogPreviewContainer';
import ContactForm from '@/components/ContactForm';
import Intro from '@/components/Intro';
import { getProjectRepos } from '@/lib/services/github.service';
import GitHubProjects from '@/components/GitHubProjects';
import useSWR from 'swr';
import { GitHubMeta } from '@/lib/types/github.types';
import { NextSeo } from 'next-seo';

const Index: NextPage = () => {
  const { setFrontMatters } = useContext(BlogSearchContext);
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

  return (
    <>
      <NextSeo
        title="joeymckenzie.tech"
        description="Personal portfolio and blog for Joey McKenzie software engineer"
      />
      <Intro />
      <BlogPreviewContainer />
      {githubMetas && <GitHubProjects metas={githubMetas} />}
      <CodeSnippets />
      <ContactForm />
    </>
  );
};

export default Index;
