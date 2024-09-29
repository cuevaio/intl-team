import { range } from '@/lib/utils';

import { LinkItemSkeleton } from '../link-item';

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {range(8).map((i) => (
        <LinkItemSkeleton key={i} />
      ))}
    </div>
  );
}
