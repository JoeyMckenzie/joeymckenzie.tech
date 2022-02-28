import { FC, useEffect, useState } from 'react';
import hljs from 'highlight.js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { upsertViewCount } from '@/lib/utilities';

interface CodeSnippet {
  title: string;
}

const CodeSnippetLayout: FC<{ meta: CodeSnippet }> = ({ children, meta }) => {
  const { route } = useRouter();
  const [codeSnippetTitle, setCodeSnippetTitle] = useState('');

  useEffect(() => {
    hljs.highlightAll();
    setCodeSnippetTitle(meta.title);
    const slug = route.split('/')[2];
    upsertViewCount(slug);
  }, [route, meta, setCodeSnippetTitle]);

  return (
    <>
      <Head>
        <title>joeymckenzie.tech &middot; {codeSnippetTitle}</title>
        <meta title={codeSnippetTitle} />
      </Head>
      <div className="relative my-24 overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-prose text-lg">
            <div className="prose prose-stone mx-auto mt-6 text-gray-600 prose-h1:text-center prose-img:mx-auto prose-img:rounded-sm prose-img:object-center dark:prose-invert dark:text-gray-300">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeSnippetLayout;
