import { ReactNode } from 'react';

import { SearchOptions } from './search-options';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SearchOptions />
      {children}
    </>
  );
}
