import { VFC } from 'react';
import BlogSearchInput from '@/components/BlogSearchInput';
import BlogHeader from '@/components/BlogHeader';
import BlogCardsContainer from '@/components/BlogCardsContainer';
import BlogCardFilteredDomainPills from '@/components/BlogCardFilteredDomainPills';

const BlogContainer: VFC = () => (
  <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
    <div className="relative mx-auto max-w-lg lg:max-w-7xl">
      <BlogHeader />
      <BlogSearchInput />
      <BlogCardFilteredDomainPills />
      <BlogCardsContainer />
    </div>
  </div>
);

export default BlogContainer;
