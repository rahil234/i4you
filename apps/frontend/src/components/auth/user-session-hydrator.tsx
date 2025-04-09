'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ok } from 'node:assert';

type Props = {
  userData: {
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
    token: string | null;
  };
};

export default function UserSessionHydrator({ userData }: Props) {
  const { setState } = useAuthStore();

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
