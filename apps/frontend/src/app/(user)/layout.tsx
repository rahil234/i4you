import React from 'react';
import { redirect } from 'next/navigation';
import UserSessionHydrator from '@/components/auth/user-session-hydrator';
import { refreshSession } from '@/lib/auth/refresh-session';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const userData = await refreshSession();

  const { shouldDelete, user } = userData;

  if (shouldDelete) {
    console.log('Token invalid, redirecting to logout handler');
    redirect('/clear-token');
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    redirect('/login');
  }

  if (user.role === 'admin') {
    console.log('User is admin, redirecting to admin dashboard');
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <UserSessionHydrator userData={userData} />
      {children}
    </div>
  );
}