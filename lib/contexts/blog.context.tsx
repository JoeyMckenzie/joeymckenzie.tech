import { createContext, Dispatch, SetStateAction, VFC } from 'react';

interface BlogContextState {
  domains: string[];
  setDomains: Dispatch<SetStateAction<string[]>>;
}

export const initialContextState: BlogContextState = {
  domains: [],
  setDomains: () => {}
};

export const BlogContext = createContext<BlogContextState>(initialContextState);
