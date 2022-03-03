import { VFC } from 'react';
import { SiGithub } from 'react-icons/si';
import { StarIcon, ExclamationIcon } from '@heroicons/react/solid';
import { GitHubMeta } from '@/lib/types/github.types';
import { BiGitRepoForked } from 'react-icons/bi';

const GitHubProjectCard: VFC<{ meta: GitHubMeta }> = ({ meta }) => (
  <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow dark:divide-stone-700 dark:bg-stone-800">
    <div className="flex w-full items-center justify-between space-x-6 p-6">
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-200">
            {meta.name}
          </h3>
          <span className="inline-block flex-shrink-0 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-green-200 dark:bg-green-800">
            {meta.language}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
          {meta.description}
        </p>
      </div>
      <SiGithub className="h-10 w-10 text-gray-900 dark:text-white" />
    </div>
    <div>
      <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-700">
        <div className="flex w-0 flex-1">
          <a
            href={meta.url}
            target="_blank"
            rel="noreferrer nofollow"
            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <StarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="ml-3">{meta.stars}</span>
          </a>
        </div>
        <div className="flex w-0 flex-1">
          <a
            href={meta.url}
            target="_blank"
            rel="noreferrer nofollow"
            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <BiGitRepoForked
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span className="ml-3">{meta.forks}</span>
          </a>
        </div>
        <div className="-ml-px flex w-0 flex-1">
          <a
            href={meta.issuesLink}
            target="_blank"
            rel="noreferrer nofollow"
            className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <ExclamationIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span className="ml-3">Report</span>
          </a>
        </div>
      </div>
    </div>
  </li>
);

export default GitHubProjectCard;
