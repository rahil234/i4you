'use server';

import { cookies } from 'next/headers';

export async function refreshSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) return { user: null, token: null, shouldDelete: false };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!refreshResponse.ok) {
      return { user: null, token: null, shouldDelete: true };
    }

    const { token } = await refreshResponse.json();

    const userResponse = await fetch(`${API_URL}/api/v1/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return { user: null, token: null, shouldDelete: true };
    }

    const user = await userResponse.json();

    return { user, token, shouldDelete: false };
  } catch {
    return { user: null, token: null, shouldDelete: true };
  }
}