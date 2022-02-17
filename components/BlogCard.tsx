import { VFC } from 'react';
import { classNames } from '@/lib/utilities/class-names';
import { FrontMatter } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import profileImage from '@/public/portfolio_pic.jpg';
import { PILL_COLORS } from '@/lib/utilities/constants';

const HEIGHT_WIDTH_PROFILE_IMAGE_SIZE = 40;

const BlogCard: VFC<{
  post: FrontMatter;
  onDomainAdded: (domain: string) => void;
}> = ({ post, onDomainAdded }) => {
  const { title, description, datetime, date, domains, readingTime, slug } =
    post;

  const blogLink = `/blog/${slug}`;

  return (
    <div>
      <div>
        <div className="inline-block space-x-1">
          {domains.map((domain, index) => (
            <span
              key={index}
              className={classNames(
                PILL_COLORS[index].pill,
                'inline-flex cursor-pointer items-center rounded-full px-3 py-0.5 text-sm font-medium'
              )}
              onClick={() => onDomainAdded(domain)}
            >
              {domain}
            </span>
          ))}
        </div>
      </div>
      <Link href={blogLink} passHref>
        <a className="mt-4 block">
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
            className="h-10 w-10 rounded-full"
            src={profileImage}
            alt="Joey McKenzie software engineer joeymckenzie.io"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
