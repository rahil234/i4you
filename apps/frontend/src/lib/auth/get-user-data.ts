import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth/get-user';
import { redirect } from 'next/navigation';
import { User } from '@i4you/shared';

export async function getUserData() {
  try {
    const cookieStore = await cookies();

    const access_token = cookieStore.get('accessToken')?.value;

    if (!access_token) {
      const refresh_token = cookieStore.get('refreshToken')?.value;
      if (!refresh_token) {
        console.log('No access token or refresh token found');
        redirect('/clear-token');
      }
    }

    return await getUser(access_token!);
  } catch (error) {
    console.log('Error getting user data:', error);
    redirect('/clear-token');
  }
}
