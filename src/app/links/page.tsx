import Link from 'next/link';

import { desc } from 'drizzle-orm';
import { CornerDownRightIcon } from 'lucide-react';

import { db, schema } from '@/db';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import CopyToClipboardButton from './copy-clipboard.-button';
import { CreateLinkForm } from './create-link-form';

export const runtime = 'edge';

export default async function Page() {
  const links = await db
    .select()
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt));

  return (
    <div className="container mx-auto my-8 space-y-8">
      <h1 className="text-xl font-bold">INTL TEAM&apos;s Links Tool</h1>
      <CreateLinkForm />

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>The links the team has created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {links.map((l) => (
              <div key={l.id} className="relative rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/l/${l.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold tracking-wide"
                  >
                    intl.team/l/{l.key}
                  </Link>
                  <CopyToClipboardButton
                    text={`https://intl.team/l/${l.key}`}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <CornerDownRightIcon className="size-3" />
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wider"
                  >
                    {l.url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
