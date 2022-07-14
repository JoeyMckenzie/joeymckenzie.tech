import {
  createContext,
  Dispatch,
  FC,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { FrontMatter } from '@/lib/types/shared.types';
import blogs from '@/public/frontmatters.json';
import { useRouter } from 'next/router';

interface BlogSearchState {
  filteredDomains: string[];
  searchText: string;
  frontMatters: FrontMatter[];
  filteredFrontMatters: FrontMatter[];
  previewMode: boolean;
}

const initialState: BlogSearchState = {
  filteredDomains: [],
  searchText: '',
  frontMatters: [],
  filteredFrontMatters: [],
  previewMode: false,
};

type BlogSearchActions =
  | { type: 'SET_SEARCH_TEXT'; payload: string }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_FRONTMATTERS'; payload: FrontMatter[] }
  | { type: 'SET_FILTERED_DOMAINS'; payload: string[] }
  | { type: 'SET_FILTERED_FRONTMATTERS'; payload: FrontMatter[] };

const blogSearchReducer: Reducer<BlogSearchState, BlogSearchActions> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case 'SET_FRONTMATTERS':
      return {
        ...state,
        frontMatters: payload as FrontMatter[],
      };
    case 'SET_FILTERED_FRONTMATTERS':
      return {
        ...state,
        filteredFrontMatters: payload as FrontMatter[],
      };
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        searchText: payload as string,
      };
    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: payload as boolean,
      };
    case 'SET_FILTERED_DOMAINS':
      return {
        ...state,
        filteredDomains: payload as string[],
      };
  }
};

interface BlogSearchContextProps {
  state: BlogSearchState;
  dispatch: Dispatch<BlogSearchActions>;
}

const BlogSearchContext = createContext<BlogSearchContextProps>({
  state: initialState,
  dispatch: () => {},
});

const BlogSearchContextProvider: FC = ({ children }) => {
  const { pathname } = useRouter();
  const { frontMatters } = blogs;
  const [state, dispatch] = useReducer(blogSearchReducer, initialState);

  useEffect(
    () =>
      dispatch({
        type: 'SET_PREVIEW_MODE',
        payload: pathname === '/',
      }),
    [pathname]
  );

  useEffect(() => {
    if (frontMatters.length === 0) {
      dispatch({
        type: 'SET_FRONTMATTERS',
        payload: frontMatters,
      });
    }

    dispatch({
      type: 'SET_FRONTMATTERS',
      payload: frontMatters,
    });
  }, [frontMatters]);

  useEffect(() => {
    dispatch({
      type: 'SET_FILTERED_FRONTMATTERS',
      payload: frontMatters.filter((fm) =>
        state.filteredDomains.every((d) => fm.domains.indexOf(d) > -1)
      ),
    });
  }, [frontMatters, state.filteredDomains]);

  return (
    <BlogSearchContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogSearchContext.Provider>
  );
};

export function useBlogSearchContext() {
  return useContext(BlogSearchContext);
}

export default BlogSearchContextProvider;
