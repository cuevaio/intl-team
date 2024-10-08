import { NextRequest } from 'next/server';

export const parse = (req: NextRequest) => {
  const domain = req.headers.get('host');
  const path = req.nextUrl.pathname;

  let key: string | undefined = undefined;
  if (path.includes('/l/')) {
    key = decodeURIComponent(path.split('/')[2]); // to handle foreign languages like Hebrew
    if (key === 'undefined') key = undefined;
  }

  return { domain, path, key };
};

export const detectBot = (req: NextRequest) => {
  const url = req.nextUrl;
  if (url.searchParams.get('bot')) return true;
  const ua = req.headers.get('User-Agent');
  if (ua) {
    /* Note:
     * - bot is for most bots & crawlers
     * - facebookexternalhit is for Facebook crawler
     * - MetaInspector is for https://metatags.io/
     */
    return /bot|facebookexternalhit|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector/i.test(
      ua,
    );
  }
  return false;
};
