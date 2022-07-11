import type { GetServerSideProps, NextPage } from 'next';
import CodeSnippets from '@/components/CodeSnippets';
import BlogPreviewContainer from '@/components/BlogPreviewContainer';
import ContactForm from '@/components/ContactForm';
import GitHubProjects from '@/components/GitHubProjects';
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
      <BlogPreviewContainer />
      {githubMetas && <GitHubProjects metas={githubMetas} />}
      <CodeSnippets />
      <ContactForm />
    </>
  );
};

export default Index;
