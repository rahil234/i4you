import type React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { DashboardHeader } from '@/components/dashboard-header';
import { getUserData } from '@/lib/auth/get-user-data';
import { Sidebar } from '@/components/sidebar';

export default async function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <div className="flex h-screen">
      <AuthSessionHydrator user={await getUserData()} />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-white p-4 shadow-sm">
          <DashboardHeader />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
