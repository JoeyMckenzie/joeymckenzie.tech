import { loadPostPreviews } from "@/lib/posts";
import BlogCard from "./blog-card";

export async function BlogPreviews({
  includeLatest,
}: {
  includeLatest: boolean;
}) {
  const posts = loadPostPreviews(includeLatest);

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.title} post={post} />
      ))}
    </div>
  );
}
