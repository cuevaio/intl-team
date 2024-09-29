import React from 'react';

import { validateRequest } from '@/auth/validate-request';
import { desc, eq } from 'drizzle-orm';

import { db, schema } from '@/db';

import { LinkItem } from '../link-item';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const validatedRequest = await validateRequest();
  const user = validatedRequest.user!;

  const links = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.ownerId, user.id))
    .orderBy(desc(schema.links.updatedAt));

  if (!links.length) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        No links yet. Create your first one!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {links.map((link) => (
        <LinkItem key={link.id} link={{ ...link, owner: user }} />
      ))}
    </div>
  );
}
