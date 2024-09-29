import Link from 'next/link';

import { User } from 'lucia';
import { CornerDownRightIcon } from 'lucide-react';

import { LinkSelect, UserSelect } from '@/db/schema';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LocalDate } from '@/components/local-date';

import CopyToClipboardButton from './copy-clipboard.-button';

export const LinkItem = ({
  link: { id, key, url, category, createdAt, owner },
}: {
  link: LinkSelect & {
    owner: User | UserSelect;
  };
}) => {
  return (
    <div key={id} className="relative space-y-2 rounded-lg border p-4">
      <div className="flex items-center space-x-2">
        <Link
          href={`/l/${key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold tracking-wide"
        >
          intl.team/l/{key}
        </Link>
        {category ? <Badge>{category}</Badge> : <></>}
        <CopyToClipboardButton text={`https://intl.team/l/${key}`} />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex size-6 flex-none items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          {owner.username![0].toUpperCase()}
        </div>
        <CornerDownRightIcon className="size-3 flex-none" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wider"
        >
          {url}
        </a>
        <div className="text-xs text-muted-foreground">
          <LocalDate date={createdAt} />
        </div>
      </div>
    </div>
  );
};

export const LinkItemSkeleton = () => {
  return (
    <div className="relative space-y-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="size-7" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="size-6 flex-none rounded-full" />
        <Skeleton className="size-3 flex-none rounded-lg" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-14 flex-none rounded-lg" />
      </div>
    </div>
  );
};
