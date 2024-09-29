import { NextRequest, NextResponse } from 'next/server';

import { parse } from '@/lib/middleware/utils';

import { lucia } from './auth';
import LinkMiddleware from './lib/middleware/link';

export default async function middleware(request: NextRequest) {
  // check if this is a short link
  const { key } = parse(request);

  if (key) {
    return LinkMiddleware(request);
  }

  const response = NextResponse.next();

  // we don't need auth in some pages
  const NO_AUTH_PATHS = ['/signin', '/signup', '/'];
  if (NO_AUTH_PATHS.find((x) => x === request.nextUrl.pathname)) {
    return response;
  }

  // we do need auth for most pages
  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return NextResponse.redirect(
      new URL(`/signin?after=${request.nextUrl.pathname}`, request.url),
    );
  }
  const result = await lucia.validateSession(sessionId);

  if (result.session && result.session.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id);
    response.cookies.set(sessionCookie.name, sessionCookie.value);
  }
  if (!result.session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    response.cookies.set(sessionCookie.name, sessionCookie.value);
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
