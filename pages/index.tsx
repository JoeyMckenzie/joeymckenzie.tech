import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
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
import { useFrontMatters } from '@/lib/hooks/use-frontmatters.hook';

const Index: NextPage = () => {
  const { githubMetas } = useFrontMatters();

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
