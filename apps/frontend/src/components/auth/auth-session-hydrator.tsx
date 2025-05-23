'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User } from '@repo/shared';
import { useRouter } from 'next/navigation';

export default function AuthSessionHydrator({ user }: { user: Omit<User, 'location'> }) {
  const { setState } = useAuthStore();

  const router = useRouter();

  console.log('user from auth hydrator', user);

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
