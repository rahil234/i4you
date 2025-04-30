import { redirect } from 'next/navigation';
import { getUser } from './get-user';
import { User } from '@repo/shared';

type UserData = {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token: string | null;
};

export async function getUserData(): Promise<UserData> {
  const userData = await getUser();

  if (!userData) {
    console.log('User data not found, redirecting to clear token');
    redirect('/clear-token');
  }

  return userData;
}
