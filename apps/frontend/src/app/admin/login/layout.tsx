import React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { getUserData } from '@/lib/auth/get-user-data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    redirect('/admin');
  }

  return children;
}
