import { CookieOptions } from 'express';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectFrom = searchParams.get('redirectFrom') || '/';
  const redirectTo = redirectFrom.startsWith('/admin') ? '/admin/login' : '/login';

  console.log('Clearing tokens, redirecting to:', redirectFrom, '→', redirectTo);

  const response = NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_APP_URL));

  const options: CookieOptions = {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
    maxAge: 0,
  };

  response.cookies.set('refreshToken', '', options);
  response.cookies.set('accessToken', '', options);
  return response;
}
