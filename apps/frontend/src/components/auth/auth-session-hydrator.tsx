'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

type UserData = {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token: string | null;
};

export default function AuthSessionHydrator({ userData }: {userData: UserData}) {
  const { setState } = useAuthStore();

  if (!userData) {
    return null;
  }
  console.log('userData from auth hydrator', userData);

  const { user, token } = userData;

  useEffect(() => {
    if (user) {
      setState({ user: user, accessToken: token, isAuthenticated: true, isLoading: false });
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [user, setState]);

  return null;
}
