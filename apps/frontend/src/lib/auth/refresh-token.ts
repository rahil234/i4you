'use server';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/verify-token';

export async function refreshToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) return null;

  try {
    await verifyToken(refreshToken);
  } catch {
    return null;
  }

  const isProd = process.env.NODE_ENV === 'production';
  const API_URL = isProd ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:4000';
  // const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!refreshResponse.ok) return null;

    const { token } = await refreshResponse.json();
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
