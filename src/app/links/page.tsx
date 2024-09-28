import Link from 'next/link';

import { CornerDownRightIcon } from 'lucide-react';

import { db, schema } from '@/db';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CreateLinkForm } from './create-link-form';

export default async function Page() {
  const links = await db.select().from(schema.links);

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
              <div
                key={l.id}
                className="relative rounded-lg border p-4 hover:bg-muted"
              >
                <div className="font-bold tracking-wide">
                  intl.team/l/{l.key}
                </div>
                <div className="flex items-center space-x-2">
                  <CornerDownRightIcon className="size-3" />
                  <div className="text-xs tracking-wider">{l.url}</div>
                </div>
                <Link href={`/l/${l.key}`} className="absolute inset-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
