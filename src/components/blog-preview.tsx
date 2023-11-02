import { getViewCounts } from '@/lib/db';
import { Post } from 'contentlayer/generated';
import { BlogCard, BlogCardProps } from './blog-card';

export async function BlogPreview({ posts }: { posts: Post[] }) {
  const viewCounts = await getViewCounts();
  const postsWithViewCount = posts.map(
    (p) =>
      ({
        ...p,
        viewCount: viewCounts.find((vc) => p.url.includes(vc.slug))?.count ?? 0,
      }) as BlogCardProps,
  );

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-3">
      {postsWithViewCount.map((post, index) => (
        <BlogCard key={index} {...post} />
      ))}
    </div>
  );
}
