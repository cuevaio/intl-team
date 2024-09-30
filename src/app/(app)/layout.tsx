import { ReactNode } from 'react';
import Link from 'next/link';

import { KeyHint } from '@/components/key-hint';
import { ThemeToggle } from '@/components/theme-toggle';

import { Logout } from './logout/logout-button';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto">
      <nav className="sticky top-0 z-50 flex h-24 items-center justify-between bg-background">
        <Link href="/" className="flex items-center font-bold">
          INTL TEAM Tools <KeyHint hint="H" />
        </Link>
        <div className="flex space-x-2">
          <Logout />
          <ThemeToggle />
        </div>
      </nav>
      <>{children}</>
    </div>
  );
}
