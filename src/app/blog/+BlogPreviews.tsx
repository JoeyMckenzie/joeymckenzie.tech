import { Blog } from 'contentlayer/generated';
import BlogPreview from './+BlogPreview';

type BlogPreviewsProps = {
  blogs: Blog[];
};

export default function BlogPreviews({
  blogs,
}: BlogPreviewsProps): JSX.Element {
  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 border-t border-neutral-800 pt-10 sm:mt-16 sm:pt-16 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {blogs.map((post) => (
        <BlogPreview key={post._id} post={post} />
      ))}
    </div>
  );
}
