'use server';

import { cookies, headers } from 'next/headers';
import { verifyToken } from '@/lib/auth/verify-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function refreshToken(): Promise<string | null> {
  const cookieHeader = (await headers()).get('cookie') || '';
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) return null;

  if (!await verifyToken(refreshToken)) {
    return null;
  }

  try {
    const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
      credentials: 'include',
    });

    console.log('old Access token: ', cookieHeader.split(';')[0]);
    const newAccessToken = refreshRes.headers.get('set-cookie')?.split(';')[0];
    console.log('\n\n\nnew Access token:', newAccessToken);

    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken.split('=')[1]);
    }

    if (!refreshRes.ok) {
      return null;
    }

    console.log('Refresh token response:', refreshRes.headers);

    const { token } = await refreshRes.json();

    if (!token) {
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
