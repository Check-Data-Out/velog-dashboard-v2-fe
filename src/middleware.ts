import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('vd_session');
  const accessToken = request.cookies.get('access_token');

  if (!session && !accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/main/:path*', '/leaderboards/:path*'],
};
