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
    pathname === '/clear-token'
  ) {
    return NextResponse.next();
  }

  // const token = request.cookies.get('accessToken')?.value;
  // if (!token) return NextResponse.redirect(new URL('/login', request.url));
  //
  // const payload = await verifyToken(token);
  // if (!payload) return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next(); // token is valid
}
