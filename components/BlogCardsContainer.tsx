import { useContext, VFC } from 'react';
import { sortFrontMatters } from '@/lib/utilities';
import { FrontMatter } from '@/lib/types';
import BlogCard from '@/components/BlogCard';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';

const BlogCardsContainer: VFC<{ previewMode: boolean }> = ({
  previewMode = false,
}) => {
  const { filteredFrontMatters } = useContext(BlogSearchContext);

  const frontMattersToDisplay = previewMode
    ? filteredFrontMatters
        .sort(sortFrontMatters)
        .slice(0, 3)
        .map((frontMatter: FrontMatter) => (
          <BlogCard key={frontMatter.slug} post={frontMatter} />
        ))
    : filteredFrontMatters
        .sort(sortFrontMatters)
        .map((frontMatter: FrontMatter) => (
          <BlogCard key={frontMatter.slug} post={frontMatter} />
        ));

  return (
    <div className="mt-12 grid gap-16 pt-6 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
      {frontMattersToDisplay}
    </div>
  );
};

export default BlogCardsContainer;
