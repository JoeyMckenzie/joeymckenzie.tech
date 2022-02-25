import { VFC } from 'react';
import BlogSearchInput from '@/components/BlogSearchInput';
import BlogHeader from '@/components/BlogHeader';
import BlogCardsContainer from '@/components/BlogCardsContainer';
import BlogCardFilteredDomainPills from '@/components/BlogCardFilteredDomainPills';
import BlogContainerMeta from '@/components/BlogContainerMeta';

const BlogContainer: VFC = () => (
  <BlogContainerMeta>
    <BlogHeader />
    <BlogSearchInput />
    <BlogCardFilteredDomainPills />
    <BlogCardsContainer previewMode={false} />
  </BlogContainerMeta>
);

export default BlogContainer;
