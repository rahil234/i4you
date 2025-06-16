'use server';

import { User } from '@i4you/shared';

const API_URL = process.env.NEXT_PRIVATE_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PRIVATE_API_URL is not defined');
}

console.log(`API_URL: ${API_URL}`);

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
