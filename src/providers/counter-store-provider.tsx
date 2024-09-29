'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';

import {
  createCounterStore,
  initCounterStore,
  type CounterStore,
} from '@/stores/counter-store';
import { useStore } from 'zustand';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initCounterStore());
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
