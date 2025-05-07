import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth/get-user';
import { refreshToken } from '@/lib/auth/refresh-token';
import { redirect } from 'next/navigation';
import { UserData } from '@/types';
import { User } from '@repo/shared';

export async function getUserData(): Promise<User> {
  try {
    const cookieStore = await cookies();

    const access_token = cookieStore.get('accessToken')?.value;

    if (!access_token) {
      const refresh_token = cookieStore.get('refreshToken')?.value;
      if (!refresh_token) {
        redirect('/clear-token');
      }
    }

    return await getUser(access_token!);
  } catch (error) {
    console.log('Error getting user data:', error);
    redirect('/clear-token');
  }
}