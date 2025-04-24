'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ClearTokenPage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    (async () => {
      await logout();
      router.push('/login');
    })();
  }, [router]);

  return <div className="h-screen flex items-center justify-center">Clearing session...</div>;
}