import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));

  const options = {
    httpOnly: true,
    path: '/',
    domain: 'i4you.local.net',
    secure: true,
    sameSite: 'none' as 'none',
    maxAge: 0,
  };

  response.cookies.set('refreshToken', '', options);
  response.cookies.set('accessToken', '', options);
  return response;
}
