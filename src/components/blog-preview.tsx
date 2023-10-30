import { Post } from 'contentlayer/generated';
import { BlogCard } from './blog-card';

export function BlogPreview({ posts }: { posts: Post[] }) {
  return (
    <div className="mx-auto max-w-xl">
      {posts.map((post, index) => (
        <BlogCard key={index} {...post} />
      ))}
    </div>
  );
}
