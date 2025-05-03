import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get('redirect') || '/';

  const refreshRes = await fetch('http://localhost:4000/api/v1/auth/refresh-token', {
    method: 'POST',
    headers: {
      Cookie: req.headers.get('cookie') ?? '',
    },
    credentials: 'include',
  });

  const setCookie = refreshRes.headers.get('set-cookie');
  console.log("refreshed redirecting to", redirectTo, req.url);
  const response = NextResponse.redirect(new URL(redirectTo, "https://i4you.local.net"));
  if (setCookie) {
    response.headers.set('Set-Cookie', setCookie);
  }

  return response;
}
