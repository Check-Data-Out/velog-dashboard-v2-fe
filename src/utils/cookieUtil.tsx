import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const getCookieForAuth = (cookies: () => ReadonlyRequestCookies, keys: string[]) => {
  const cookie = { headers: {} as Record<string, string> };
  keys.forEach((i) => (cookie.headers[i] = cookies().get(i)?.value || ''));
  return cookie;
};
