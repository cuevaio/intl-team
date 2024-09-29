import { createStore } from 'zustand/vanilla';

export type SearchOptionsState = {
  searchBy: 'url' | 'key';
};

export type SearchOptionsActions = {
  setSearchBy: (searchBy: 'url' | 'key') => void;
};

export type SearchOptionsStore = SearchOptionsState & SearchOptionsActions;

export const initSearchOptionsStore = (): SearchOptionsState => {
  return { searchBy: 'url' };
};

export const defaultInitState: SearchOptionsState = {
  searchBy: 'url',
};

export const createSearchOptionsStore = (
  initState: SearchOptionsState = defaultInitState,
) => {
  return createStore<SearchOptionsStore>()((set) => ({
    ...initState,
    setSearchBy: (searchBy: 'url' | 'key') =>
      set((state) => ({ ...state, searchBy })),
  }));
};
