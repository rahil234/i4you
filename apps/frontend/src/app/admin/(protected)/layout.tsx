import type React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { DashboardHeader } from '@/components/dashboard-header';
import { getUserData } from '@/lib/auth/get-user-data';
import { Sidebar } from '@/components/sidebar';
import { redirect } from 'next/navigation';
import { ReactQueryProvider } from '@/lib/react-query/provider';

export default async function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {

  const user = await getUserData();

  if (user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen">
      <ReactQueryProvider>
        <AuthSessionHydrator user={user} />
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b bg-white p-4 shadow-sm">
            <DashboardHeader />
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </ReactQueryProvider>
    </div>
  );
}
