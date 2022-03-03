import { VFC } from 'react';

interface CodeSnippetCardProps {
  title: string;
  description: string;
  icons: JSX.Element[];
}

const CodeSnippetCard: VFC<CodeSnippetCardProps> = ({
  title,
  description,
  icons,
}) => (
  <div key={title} className="pt-6">
    <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8 dark:bg-stone-800">
      <div className="-mt-6">
        <div className="space-x-2">
          {icons.map((icon, index) => (
            <span
              key={index}
              className="inline-flex items-center justify-center rounded-md bg-gray-800 p-3 shadow-lg dark:bg-stone-700"
            >
              {icon}
            </span>
          ))}
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
