import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type ViewCount = {
  slug: string;
  count: number;
};

type ViewCountContextState = {
  viewCounts: ViewCount[];
  setViewCounts: Dispatch<SetStateAction<ViewCount[]>>;
};

const ViewCountContext = createContext<ViewCountContextState>({
  viewCounts: [],
  setViewCounts: () => {},
});

export function ViewCountProvider() {
  const [viewCounts, setViewCounts] = useState<ViewCount[]>([]);

  return (
    <ViewCountContext.Provider
      value={{ viewCounts, setViewCounts }}
    ></ViewCountContext.Provider>
  );
}

export function useViewCountContext() {
  return useContext(ViewCountContext);
}
