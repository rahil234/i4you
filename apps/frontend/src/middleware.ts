import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/verify-token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/ap') ||
    pathname.startsWith('/onboarding') ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/login-with-otp' ||
    pathname === '/reset-password' ||
    pathname === '/verify' ||
    pathname === '/signup' ||
    pathname === '/admin/login' ||
    pathname === '/favicon.ico' ||
    pathname === '/refresh-token' ||
    pathname === '/refresh-token-api' ||
    pathname === '/clear-token'
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAccessTokenValid = await verifyToken(accessToken);
  const isRefreshTokenValid = await verifyToken(refreshToken);

  if (refreshToken && !isRefreshTokenValid) {
    console.log('Refresh token expired, redirecting to clear-token page');
    return NextResponse.redirect(new URL('/clear-token', request.url));
  }

  if (!isAccessTokenValid && isRefreshTokenValid) {
    if (pathname === '/refresh-token-api') {
      console.log('Access token expired, redirecting to refresh-token page', pathname);
      const redirectTo = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/refresh-token-api?redirect=${redirectTo}`, request.url));
    }
    return NextResponse.redirect(new URL('/clear-token', request.url));
  }

  if (!isRefreshTokenValid && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}
