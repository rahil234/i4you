import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/discover',
    // '/dashboard/:path*',  // all routes under /dashboard
    // '/profile',           // only /profile
    // '/admin/:path*',      // all routes under /admin
  ],
};