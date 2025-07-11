'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User } from '@i4you/shared';
import { useRouter } from 'next/navigation';

export default function AuthSessionHydrator({ user }: { user: Omit<User, 'location'> }) {
  const { setState } = useAuthStore();

  const router = useRouter();

  if (!user) {
    return null;
  }

  useEffect(() => {
    if (user) {
      setState({ user: user as typeof user & { location: string }, isAuthenticated: true, isLoading: false });
      if (user.onboarding) {
        router.push('/onboarding');
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [user, setState]);

  return null;
}
