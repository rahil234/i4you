'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/auth-store';

export default function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshToken } = useAuthStore();

  console.log('refreshing token from client');

  useEffect(() => {
    (async () => {
      const token = await refreshToken();
      if (!token) {
        router.push('/clear-token');
      }
      const redirectTo = searchParams.get('redirect') || '/';
      router.replace(redirectTo);
    })();
  }, [searchParams, router]);

  return <>refreshing token please wait</>;
}