import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import frontMatters from '@/public/frontmatters.json';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';
import CodeSnippets from '@/components/CodeSnippets';
import BlogPreviewContainer from '@/components/BlogPreviewContainer';
import ContactForm from '@/components/ContactForm';
import AboutHero from '@/components/AboutHero';
import Intro from '@/components/Intro';

const Index: NextPage = () => {
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
      <CodeSnippets />
      <ContactForm />
    </>
  );
};

export default Index;
