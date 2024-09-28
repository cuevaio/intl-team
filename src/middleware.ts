import { NextRequest, NextResponse } from 'next/server';

import { parse } from '@/lib/middleware/utils';

import LinkMiddleware from './lib/middleware/link';

export default async function middleware(req: NextRequest) {
  const { key } = parse(req);

  console.log({ key });

  if (key) {
    return LinkMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/l/:path*',
};
