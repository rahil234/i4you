'use server';

import { cookies } from 'next/headers';
import { User } from '@repo/shared';
import { refreshToken as getNewAccessToken } from '@/lib/auth/refresh-token';
import { verifyToken } from '@/lib/auth/verify-token';

type UserData = {
  user: User | null;
  token: string | null;
};

const apiUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000';

export async function getUser(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) return null;

  if (!accessToken) {
    const newToken = await getNewAccessToken();

    if (!newToken) return null;

    const userData = await fetchUserWithToken(newToken);

    if (!userData) return null;

    return userData;
  }

  const isValid = verifyToken(accessToken);

  if (!isValid) return null;

  const userData = await fetchUserWithToken(accessToken);

  if (!userData) return null;

  return userData;
}

async function fetchUserWithToken(token: string): Promise<UserData | null> {
  try {

    const res = await fetch(`${apiUrl}/api/v1/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const user = await res.json();

    return {
      user,
      token,
    };

  } catch (err) {
    console.log('Error fetching user data:', err);
    return null;
  }
}