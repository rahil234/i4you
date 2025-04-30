import React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { getUserData } from '@/lib/auth/get-user-data';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const userData = await getUserData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <AuthSessionHydrator userData={userData} />
      {children}
    </div>
  );
}
