import React from 'react';
import { redirect } from 'next/navigation';
import UserSessionHydrator from '@/components/auth/user-session-hydrator';
import { refreshSession } from '@/lib/auth/refresh-session';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const userData = await refreshSession();

  // if (!userData) {
  //   console.log('User data not found, redirecting to login');
  //   redirect('/login');
  // }
  console.log('User data ', userData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <UserSessionHydrator userData={userData} />
      {children}
    </div>
  );
}