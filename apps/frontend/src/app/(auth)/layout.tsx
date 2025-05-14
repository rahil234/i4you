import type React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/app/(auth)/auth-provider';

export default async function AuthLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (accessToken) {
    redirect('/discover');
  }

  return (
    <AuthProvider>
      <div className="min-h-screen  bg-background">{children}</div>
    </AuthProvider>
  );
}
