import { Post } from 'contentlayer/generated';
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from './ui/badge';

export function BlogCard(post: Post) {
  return (
    <article
      key={post._id}
      className="flex max-w-xl flex-col items-start justify-between"
    >
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={post.pubDate}>
          {format(new Date(post.pubDate), 'PP')}
        </time>
        <Badge>{post.category}</Badge>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6">
          <Link href={post.url}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6">
          {post.description}
        </p>
      </div>
    </article>
  );
}
