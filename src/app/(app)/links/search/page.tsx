import React from 'react';

import { validateRequest } from '@/auth/validate-request';
import {
  and,
  cosineDistance,
  desc,
  eq,
  gt,
  inArray,
  or,
  sql,
} from 'drizzle-orm';

import { db, schema } from '@/db';

import { generateEmbedding } from '@/lib/generate-embedding';

import { LinkItem } from '../link-item';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export default async function Page({
  searchParams: { query, searchBy },
}: {
  searchParams: { query: string; searchBy: 'url' | 'key' };
}) {
  if (!query) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Search something
      </p>
    );
  }

  const { user } = await validateRequest();
  const embedding = await generateEmbedding(query);

  const searchByUrl = searchBy === 'url' ? true : false;

  const similarity = sql<number>`1 - (${cosineDistance(searchByUrl ? schema.links.urlEmbedding : schema.links.keyEmbedding, embedding)})`;

  const _links = await db
    .select({
      id: schema.links.id,
      similarity,
    })
    .from(schema.links)
    .where(
      and(
        gt(similarity, 0.1),
        or(eq(schema.links.ownerId, user!.id), eq(schema.links.isPublic, true)),
      ),
    )
    .orderBy((t) => desc(t.similarity))
    .limit(10);

  const links = await db.query.links.findMany({
    with: {
      owner: true,
    },
    where: inArray(
      schema.links.id,
      _links.map((l) => l.id),
    ),
  });

  links.sort((a, b) => {
    const aSimilarity = _links.find((l) => l.id === a.id)!.similarity;
    const bSimilarity = _links.find((l) => l.id === b.id)!.similarity;

    return bSimilarity - aSimilarity;
  });

  if (!links.length) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        No links found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {links.map((link) => (
        <LinkItem key={link.id} link={link} />
      ))}
    </div>
  );
}
