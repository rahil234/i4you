'use server';

export const getUsers = async (token: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/api/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
};