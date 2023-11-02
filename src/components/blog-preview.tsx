import { getViewCounts } from '@/lib/db';
import { Post } from 'contentlayer/generated';
import { BlogCard } from './blog-card';

export async function BlogPreview({ posts }: { posts: Post[] }) {
  const viewCounts = await getViewCounts();

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-3">
      {posts.map((post, index) => (
        <BlogCard key={index} {...post} />
      ))}
    </div>
  );
}
