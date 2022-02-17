import type { NextPage } from 'next';
import Hero from '@/components/Hero';
import BlogContainer from '@/components/BlogContainer';
import Head from 'next/head';

const Index: NextPage = () => (
  <>
    <Head>
      <title>joeymckenzie.tech</title>
    </Head>
    <Hero />
    <BlogContainer />
  </>
);

export default Index;
