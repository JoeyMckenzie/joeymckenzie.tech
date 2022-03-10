import { VFC } from 'react';
import { sortFrontMatters } from '@/lib/utilities';
import { FrontMatter } from '@/lib/types/shared.types';
import BlogCard from '@/components/BlogCard';
import { useBlogSearchContext } from '@/lib/contexts/blog-search.context';

const BlogCardsContainer: VFC<{ previewMode: boolean }> = ({
  previewMode = false,
}) => {
  const { state } = useBlogSearchContext();

  const frontMattersToDisplay = previewMode
    ? state.filteredFrontMatters
        .sort(sortFrontMatters)
        .slice(0, 3)
        .map((frontMatter: FrontMatter) => (
          <BlogCard key={frontMatter.slug} post={frontMatter} />
        ))
    : state.filteredFrontMatters
        .sort(sortFrontMatters)
        .map((frontMatter: FrontMatter) => (
          <BlogCard key={frontMatter.slug} post={frontMatter} />
        ));

  return (
    <div className="grid gap-16 pt-6 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
      {frontMattersToDisplay}
    </div>
  );
};

export default BlogCardsContainer;
