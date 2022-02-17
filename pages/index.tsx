import type { NextPage } from 'next';
import Hero from '@/components/Hero';
import BlogContainer from '@/components/BlogContainer';

const Index: NextPage = () => (
  <>
    <Hero />
    <BlogContainer />
  </>
);

export default Index;
