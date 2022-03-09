import hljs from 'highlight.js';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { CodeSnippet } from '../types/shared.types';
import { upsertViewCount } from '../utilities';

export function useCodeSnippet(meta: CodeSnippet) {
  const { route } = useRouter();
  const [codeSnippetTitle, setCodeSnippetTitle] = useState('');

  useEffect(() => {
    hljs.highlightAll();
    setCodeSnippetTitle(meta.title);
    const slug = route.split('/')[2];
    upsertViewCount(slug);
  }, [route, meta, setCodeSnippetTitle]);

  return { codeSnippetTitle };
}
