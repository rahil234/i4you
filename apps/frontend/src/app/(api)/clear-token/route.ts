import { CookieOptions } from 'express';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));

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
