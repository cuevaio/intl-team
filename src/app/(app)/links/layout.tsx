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

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Links</CardTitle>
          <div className="flex space-x-2">
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
        <CardDescription>
          A collection of useful links. Also, a short links service like Bitly.
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
