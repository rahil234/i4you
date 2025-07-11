import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get('redirect') || '/';

  console.log('referesh-token-api called, redirecting to headers', req.headers.get('cookie'));

  const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: {
      Cookie: req.headers.get('cookie') || '',
    },
    credentials: 'include',
  });

  // if (!refreshRes.ok) {
  //   console.error('Failed to refresh token', refreshRes.status, refreshRes.statusText);
  //   return NextResponse.redirect(new URL('/clear-token', API_URL));
  // }

  console.log('Refresh token response', refreshRes);

  const setCookie = refreshRes.headers.get('set-cookie');
  const response = NextResponse.redirect(new URL(redirectTo, API_URL));
  if (setCookie) {
    response.headers.set('Set-Cookie', setCookie);
  }

  return response;
}
