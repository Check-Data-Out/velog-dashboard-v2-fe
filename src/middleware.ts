import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.cookies.get('vd_session')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/main/:path*', '/leaderboards/:path*'],
};
