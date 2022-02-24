import { VFC } from 'react';
import { CodeIcon } from '@heroicons/react/outline';

interface CodeSnippetCardProps {
  title: string;
  description: string;
}

const CodeSnippetCard: VFC<CodeSnippetCardProps> = ({ title, description }) => (
  <div key={title} className="pt-6">
    <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8 dark:bg-stone-800">
      <div className="-mt-6">
        <div>
          <span className="inline-flex items-center justify-center rounded-md bg-gray-800 p-3 shadow-lg dark:bg-stone-700">
            <CodeIcon className="h-6 w-6 text-white" />
          </span>
        </div>
        <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900 dark:text-gray-200">
          {title}
        </h3>
        <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default CodeSnippetCard;
