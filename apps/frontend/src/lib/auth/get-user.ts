'use server';

import { User } from '@repo/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUser(accessToken: string): Promise<User> {
  try {

    let res = await fetch(`${API_URL}/api/v1/user/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}
