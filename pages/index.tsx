import type { NextPage } from 'next';
import Hero from '@/components/Hero';
import BlogContainer from '@/components/BlogContainer';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import frontMatters from '@/public/frontmatters.json';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';

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
      </Head>
      <Hero />
      <BlogContainer />
    </>
  );
};

export default Index;
