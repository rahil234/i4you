import React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { getUserData } from '@/lib/auth/get-user-data';
import { redirect } from 'next/navigation';
import NotificationListener from '@/components/user/NotificationListener';
import GlobalVideoCallOverlay from '@/components/user/GlobalVideoCallOverlay';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const user = await getUserData();

  if (user && user.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <AuthSessionHydrator user={user} />
      {children}
      <NotificationListener />
      {/* Global video call listener/overlay for user area */}
      <GlobalVideoCallOverlay />
    </div>
  );
}
