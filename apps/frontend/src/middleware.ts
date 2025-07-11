import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/verify-token';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const publicExactPaths = [
    '/login',
    '/forgot-password',
    '/login-with-otp',
    '/reset-password',
    '/verify',
    '/signup',
    '/admin/login',
    '/favicon.ico',
    '/refresh-token',
    '/refresh-token-api',
    '/clear-token',
  ];

  const publicPathStartsWith = ['/_next', '/api', '/onboarding'];

  if (
    publicExactPaths.includes(pathname) ||
    publicPathStartsWith.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAccessTokenValid = await verifyToken(accessToken);
  const isRefreshTokenValid = await verifyToken(refreshToken);

  if (!isAccessTokenValid && !isRefreshTokenValid) {
    console.log('No valid tokens found, redirecting to clear-token page');
    return NextResponse.redirect(new URL(`/clear-token?redirectFrom=${pathname}`, request.url));
  }

  // If refresh token exists but is invalid → force logout
  if (refreshToken && !isRefreshTokenValid) {
    console.log('Refresh token expired, redirecting to clear-token page');
    return NextResponse.redirect(new URL(`/clear-token?redirectFrom=${pathname}`, request.url));
  }

  // If access token is invalid but refresh token is valid → try refresh
  if (!isAccessTokenValid && isRefreshTokenValid) {
    if (pathname !== '/refresh-token-api') {
      const redirectTo = encodeURIComponent(pathname + search);
      return NextResponse.redirect(new URL(`/refresh-token-api?redirect=${redirectTo}`, request.url));
    }
    return NextResponse.next();
  }

  // All good → continue
  console.log('Access token is valid, proceeding with request:', pathname);
  return NextResponse.next();
}