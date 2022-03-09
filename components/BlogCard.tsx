import { VFC } from 'react';
import { FrontMatter } from '@/lib/types/shared.types';
import { classNames } from '@/lib/utilities';
import { PILL_COLORS } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import profileImage from '@/public/portfolio_pic.jpg';
import { useBlogCard } from '@/lib/hooks/use-blog-card.hook';

const HEIGHT_WIDTH_PROFILE_IMAGE_SIZE = 40;

const BlogCard: VFC<{
  post: FrontMatter;
}> = ({ post }) => {
  const { title, description, datetime, date, domains, readingTime, slug } =
    post;
  const apiLink = `/api/views/${slug}`;
  const blogLink = `/blog/${slug}`;

  const { addDomain, addBlogView, blogViews } = useBlogCard(apiLink);

  return (
    <div>
      <div>
        <div className="inline-block space-x-1">
          {domains.map((domain, index) => (
            <span
              key={index}
              onClick={() => addDomain(domain)}
              className={classNames(
                PILL_COLORS[index].pill,
                'inline-flex cursor-pointer items-center rounded-full px-3 py-0.5 text-sm font-medium'
              )}
            >
              {domain}
            </span>
          ))}
        </div>
      </div>
      <Link href={blogLink} passHref>
        <a onClick={addBlogView} className="mt-4 block">
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-300">
            {title}
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </a>
      </Link>
      <div className="mt-6 flex items-center">
        <div className="flex-shrink-0">
          <span className="sr-only">Joey McKenzie</span>
          <Image
            height={HEIGHT_WIDTH_PROFILE_IMAGE_SIZE}
            width={HEIGHT_WIDTH_PROFILE_IMAGE_SIZE}
            className="rounded-full"
            src={profileImage}
            alt="Joey McKenzie software engineer joeymckenzie.tech"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Joey McKenzie
          </p>
          <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={datetime}>{date}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime} read</span>
            {blogViews && blogViews > 0 ? (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{blogViews} total views</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
