import { ReactNode } from 'react';
import Link from 'next/link';

import { Logout } from './logout/logout-button';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto">
      <nav className="sticky top-0 z-50 flex h-24 items-center justify-between bg-background">
        <Link href="/" className="font-bold">
          INTL TEAM Tools
        </Link>
        <Logout />
      </nav>
      <>{children}</>

      <p className="mb-6 mt-16 text-center">
        <a
          href="https://cueva.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline"
        >
          © 2024 Anthony Cueva
        </a>
      </p>
    </div>
  );
}
