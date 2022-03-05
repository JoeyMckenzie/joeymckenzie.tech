import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
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
      <Head>
        <title>joeymckenzie.tech</title>
        <meta title="joeymckenzie.tech" />
      </Head>
      <Intro />
      <BlogPreviewContainer />
      {githubMetas && <GitHubProjects metas={githubMetas} />}
      <CodeSnippets />
      <ContactForm />
    </>
  );
};

export default Index;
