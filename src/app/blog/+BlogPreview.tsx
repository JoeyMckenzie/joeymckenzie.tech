import { getFormattedDate } from '@/lib/utils';
import { Blog } from 'contentlayer/generated';

type BlogPreviewProps = {
  post: Blog;
};

export default function BlogPreview({ post }: BlogPreviewProps): JSX.Element {
  return (
    <article
      key={post._id}
      className="mx-auto flex max-w-xl flex-col items-start justify-between"
    >
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={post.date} className="text-neutral-500">
          {getFormattedDate(post.date)}
        </time>
        <span className="relative z-10 rounded-full bg-neutral-800 py-1.5 px-3 font-medium text-neutral-400">
          {post.category}
        </span>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-neutral-300 group-hover:text-neutral-400">
          <a href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </a>
        </h3>
        <p className="mt-5 text-sm leading-6 text-neutral-400 line-clamp-3">
          {post.summary}
        </p>
      </div>
    </article>
  );
}
