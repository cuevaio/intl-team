import Link from 'next/link';

import { CornerDownRightIcon } from 'lucide-react';

import { db } from '@/db';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LocalDate } from '@/components/local-date';

import CopyToClipboardButton from './copy-clipboard.-button';
import { CreateLinkForm } from './create-link-form';

export const preferredRegion = 'iad1';

export default async function Page() {
  const links = await db.query.links.findMany({
    where: ({ isPublic }, { eq }) => eq(isPublic, true),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    with: {
      owner: true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Links</CardTitle>
          <CreateLinkForm />
        </div>
        <CardDescription>The links the team has created</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {links.map((l) => (
            <div
              key={l.id}
              className="relative space-y-2 rounded-lg border p-4"
            >
              <div className="flex items-center space-x-2">
                <Link
                  href={`/l/${l.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold tracking-wide"
                >
                  intl.team/l/{l.key}
                </Link>
                {l.category ? <Badge>{l.category}</Badge> : <></>}
                <CopyToClipboardButton text={`https://intl.team/l/${l.key}`} />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex size-6 flex-none items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {l.owner.username![0].toUpperCase()}
                </div>
                <CornerDownRightIcon className="size-3 flex-none" />
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wider"
                >
                  {l.url}
                </a>
                <div className="text-xs text-muted-foreground">
                  <LocalDate date={l.createdAt} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
