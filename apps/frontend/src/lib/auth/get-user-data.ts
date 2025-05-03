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

    return await getUser(access_token!);
  } catch (error) {
    redirect('/clear-token');
  }
}