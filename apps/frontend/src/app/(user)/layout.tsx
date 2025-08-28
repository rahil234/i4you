import React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { getUserData } from '@/lib/auth/get-user-data';
import { redirect } from 'next/navigation';
import NotificationListener from '@/components/user/notification-listener';
import GlobalVideoCallOverlay from '@/components/user/global-video-call-overlay';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const user = await getUserData();

  if (user && user.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div>
      <AuthSessionHydrator user={user} />
      {children}
      <NotificationListener />
      {/* Global video call listener/overlay for user area */}
      <GlobalVideoCallOverlay />
    </div>
  );
}
