import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const redirectTo = searchParams.get('redirect') || '/';

    const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: req.headers.get('cookie') ?? '',
      },
      credentials: 'include',
    });

    const setCookie = refreshRes.headers.get('set-cookie');
    const response = NextResponse.redirect(new URL(redirectTo, API_URL));
    if (setCookie) {
      response.headers.set('Set-Cookie', setCookie);
    }

    return response;
  } catch (err) {
    console.error('Error refreshing token:', err);
    return NextResponse.redirect(new URL('/login', API_URL));
  }
}
