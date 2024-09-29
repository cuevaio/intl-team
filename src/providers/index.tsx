'use client';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { TooltipProvider } from '@/components/ui/tooltip';

import { CounterStoreProvider } from './counter-store-provider';
import { SearchOptionsStoreProvider } from './search-options-provider';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <CounterStoreProvider>
            <SearchOptionsStoreProvider>{children}</SearchOptionsStoreProvider>
          </CounterStoreProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
