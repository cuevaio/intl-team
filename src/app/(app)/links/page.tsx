import React from 'react';

import { db } from '@/db';

import { LinkItem } from './link-item';

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {links.map((link) => (
        <LinkItem key={link.id} link={link} />
      ))}
    </div>
  );
}
