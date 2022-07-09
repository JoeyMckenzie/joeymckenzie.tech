import { NextPage } from 'next';
import BlogContainer from '@/components/BlogContainer';
import { NextSeo } from 'next-seo';

const Index: NextPage = () => (
  <>
    <NextSeo
      title="joeymckenzie.tech &middot; blog"
      description="Blog section of personal portfolio"
    />
    <BlogContainer />
  </>
);

export default Index;
