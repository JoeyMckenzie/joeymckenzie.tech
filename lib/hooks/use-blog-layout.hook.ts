import hljs from 'highlight.js';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useBlogSearchContext } from '../contexts/blog-search.context';

export function useBlogLayout() {
  const { route } = useRouter();
  const { state } = useBlogSearchContext();
  const [blogTitle, setBlogTitle] = useState('');

  useEffect(() => {
    hljs.highlightAll();

    const slug = route.split('/')[2];
    const frontMatter = state.frontMatters.find((fm) => fm.slug === slug);

    if (frontMatter) {
      setBlogTitle(frontMatter.title);
    }
  }, [route, state.frontMatters, setBlogTitle]);

  return { blogTitle };
}
