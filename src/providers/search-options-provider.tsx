'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';

import {
  createSearchOptionsStore,
  initSearchOptionsStore,
  type SearchOptionsStore,
} from '@/stores/search-options-store';
import { useStore } from 'zustand';

export type SearchOptionsStoreApi = ReturnType<typeof createSearchOptionsStore>;

export const SearchOptionsStoreContext = createContext<
  SearchOptionsStoreApi | undefined
>(undefined);

export interface SearchOptionsStoreProviderProps {
  children: ReactNode;
}

export const SearchOptionsStoreProvider = ({
  children,
}: SearchOptionsStoreProviderProps) => {
  const storeRef = useRef<SearchOptionsStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createSearchOptionsStore(initSearchOptionsStore());
  }

  return (
    <SearchOptionsStoreContext.Provider value={storeRef.current}>
      {children}
    </SearchOptionsStoreContext.Provider>
  );
};

export const useSearchOptionsStore = <T,>(
  selector: (store: SearchOptionsStore) => T,
): T => {
  const searchOptionsStoreContext = useContext(SearchOptionsStoreContext);

  if (!searchOptionsStoreContext) {
    throw new Error(
      `useSearchOptionsStore must be used within SearchOptionsStoreProvider`,
    );
  }

  return useStore(searchOptionsStoreContext, selector);
};
