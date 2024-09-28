import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';

import { db, schema } from '@/db';

import { detectBot, parse } from './utils';

export default async function LinkMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { domain, key } = parse(req);

  if (!domain || !key) {
    return NextResponse.next();
  }

  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.key, key));

  if (link) {
    const isBot = detectBot(req);
    if (isBot) {
      // rewrite to proxy page (/_proxy/[domain]/[key]) if it's a bot
      return NextResponse.rewrite(new URL(`/_proxy/${domain}/${key}`, req.url));
    } else {
      return NextResponse.redirect(link.url);
    }
  } else {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}
