import { createContext, FC, useContext, useEffect, useState } from 'react';
import { ContextDispatch, FrontMatter } from '@/lib/types/shared.types';
import blogs from '@/public/frontmatters.json';
import { useRouter } from 'next/router';

interface BlogSearchContextProps {
  filteredDomains: string[];
  searchText: string;
  frontMatters: FrontMatter[];
  filteredFrontMatters: FrontMatter[];
  previewMode: boolean;
  setFilteredDomains: ContextDispatch<string[]>;
  setSearchText: ContextDispatch<string>;
  setFrontMatters: ContextDispatch<FrontMatter[]>;
  setFilteredFrontMatters: ContextDispatch<FrontMatter[]>;
}

export const BlogSearchContext = createContext<BlogSearchContextProps>({
  filteredDomains: [],
  searchText: '',
  frontMatters: [],
  filteredFrontMatters: [],
  previewMode: false,
  setFilteredDomains: () => {},
  setSearchText: () => {},
  setFrontMatters: () => {},
  setFilteredFrontMatters: () => {},
});

const BlogSearchContextProvider: FC = ({ children }) => {
  const { pathname } = useRouter();

  const [domains, setDomains] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [frontMatters, setFrontMatters] = useState<FrontMatter[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [filteredFrontMatters, setFilteredFrontMatters] = useState<
    FrontMatter[]
  >([]);

  useEffect(
    () => setFilteredFrontMatters(frontMatters),
    [frontMatters, setFilteredFrontMatters]
  );

  useEffect(() => setPreviewMode(pathname === '/'), [pathname, setPreviewMode]);

  useEffect(() => {
    if (frontMatters.length === 0) {
      setFrontMatters(blogs.frontMatters);
    }
  }, [frontMatters, setFrontMatters]);

  useEffect(() => {
    setFilteredFrontMatters(
      frontMatters.filter((fm) =>
        domains.every((d) => fm.domains.indexOf(d) > -1)
      )
    );
  }, [domains, frontMatters, setFilteredFrontMatters]);

  return (
    <BlogSearchContext.Provider
      value={{
        filteredDomains: domains,
        searchText,
        filteredFrontMatters,
        frontMatters,
        previewMode,
        setFilteredDomains: setDomains,
        setSearchText,
        setFilteredFrontMatters,
        setFrontMatters,
      }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
};

export function useBlogSearchContext() {
  return useContext(BlogSearchContext);
}

export default BlogSearchContextProvider;
