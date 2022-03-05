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
import { GitHubMeta } from '@/lib/types/github.types';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      githubMetas: await getProjectRepos(),
    } as { githubMetas: GitHubMeta[] },
  };
};

const Index: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ githubMetas }) => {
  const { setFrontMatters } = useContext(BlogSearchContext);

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
