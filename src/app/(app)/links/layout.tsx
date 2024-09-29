import { ReactNode } from 'react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KeyHint } from '@/components/key-hint';

import { CreateLinkForm } from './create-link-form';
import { LinkSearch } from './link-search';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>
          A collection of useful links. Also, a short links service like Bitly.
        </CardDescription>

        <div className="grid grid-cols-2 items-center gap-4">
          <LinkSearch />
          <div className="flex justify-end space-x-2">
            <Link
              href="/links"
              className={buttonVariants({ variant: 'outline' })}
            >
              Team links <KeyHint hint="L" />
            </Link>
            <Link
              href="/links/personal"
              className={buttonVariants({ variant: 'outline' })}
            >
              Personal links <KeyHint hint="P" />
            </Link>
            <CreateLinkForm />
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
