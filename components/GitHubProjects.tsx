import { VFC } from 'react';
import { GitHubMeta } from '@/lib/types/github.types';
import GitHubProjectCard from '@/components/GitHubProjectCard';

const GitHubProjects: VFC<{ metas: GitHubMeta[] }> = ({ metas }) => (
  <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
    <div className="pb-8 text-center">
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
        Open Source Projects
      </p>
      <p className="mx-auto mt-5 max-w-prose text-gray-500 dark:text-gray-400">
        A handful of projects I maintain and work on in my spare time. Found an
        issue? Report it!
      </p>
    </div>
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {metas
        .sort((meta) => meta.stars)
        .map((meta, index) => (
          <GitHubProjectCard key={index} meta={meta} />
        ))}
    </ul>
  </div>
);

export default GitHubProjects;
