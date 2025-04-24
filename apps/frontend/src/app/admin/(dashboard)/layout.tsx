import type React from 'react';
import { Sidebar } from '@/components/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { refreshSession } from '@/lib/auth/refresh-session';
import { redirect } from 'next/navigation';
import UserSessionHydrator from '@/components/auth/user-session-hydrator';

export default async function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const userData = await refreshSession();

  console.log('User data from refresh session', userData);

  const { shouldDelete, user } = userData;

  if (shouldDelete) {
    console.log('Token invalid, redirecting to logout handler');
    redirect('/clear-token');
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    redirect('/admin/login');
  }

  console.log('User data ', userData);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-white p-4 shadow-sm">
          <DashboardHeader />
          <UserSessionHydrator userData={userData} />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
