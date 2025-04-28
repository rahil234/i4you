'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

type Props = {
  userData: {
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
    token: string | null;
    shouldDelete: boolean;
  };
};

export default function UserSessionHydrator({ userData }: Props) {
  const router = useRouter();

  const { setState, logout, isLoading } = useAuthStore();

  const { user, token, shouldDelete } = userData;

  const handleDeleteUserSession = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    if (user && token) {
      setState({ user: user, accessToken: token, isAuthenticated: true, isLoading: false });
    } else {
      if (shouldDelete) {
        setState({ user: null, isAuthenticated: false, isLoading: true });
        handleDeleteUserSession();
      }
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [user, setState]);

  return null;
}
