import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/onboarding') ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/login-with-otp' ||
    pathname === '/reset-password' ||
    pathname === '/verify' ||
    pathname === '/signup' ||
    pathname === '/admin/login' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('refreshToken')?.value;

  console.log(`token: ${token}`);

  // if (!token) {
  //   if (pathname.startsWith('/admin')) {
  //     return NextResponse.redirect(new URL('/admin/login', request.url));
  //   }
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

//
// export const config = {
//   matcher: ['/'],
// };