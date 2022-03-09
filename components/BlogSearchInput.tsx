import { VFC } from 'react';
import { useBlogSearchInput } from '@/lib/hooks/use-blog-search.hook';

const BlogSearchInput: VFC = () => {
  const { searchText, onSearch } = useBlogSearchInput();

  return (
    <div className="mx-auto max-w-lg pt-8">
      <input
        type="text"
        name="blog-search"
        id="blog-search"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 dark:focus:border-stone-700 dark:focus:ring-stone-700 sm:text-sm"
        placeholder="Looking for a blog?"
        value={searchText}
        onChange={onSearch}
      />
    </div>
  );
};

export default BlogSearchInput;
