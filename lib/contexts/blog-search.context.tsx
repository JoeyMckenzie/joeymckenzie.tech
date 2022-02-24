import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { FrontMatter } from '@/lib/types';
import blogs from '@/public/frontmatters.json';

interface BlogSearchContextProps {
  filteredDomains: string[];
  searchText: string;
  frontMatters: FrontMatter[];
  filteredFrontMatters: FrontMatter[];
  setFilteredDomains: Dispatch<SetStateAction<string[]>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  setFrontMatters: Dispatch<SetStateAction<FrontMatter[]>>;
  setFilteredFrontMatters: Dispatch<SetStateAction<FrontMatter[]>>;
}

export const BlogSearchContext = createContext<BlogSearchContextProps>({
  filteredDomains: [],
  searchText: '',
  frontMatters: [],
  filteredFrontMatters: [],
  setFilteredDomains: () => {},
  setSearchText: () => {},
  setFrontMatters: () => {},
  setFilteredFrontMatters: () => {},
});

const BlogSearchContextProvider: FC = ({ children }) => {
  const [domains, setDomains] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [frontMatters, setFrontMatters] = useState<FrontMatter[]>([]);
  const [filteredFrontMatters, setFilteredFrontMatters] = useState<
    FrontMatter[]
  >([]);

  useEffect(
    () => setFilteredFrontMatters(frontMatters),
    [frontMatters, setFilteredFrontMatters]
  );

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

export default BlogSearchContextProvider;
