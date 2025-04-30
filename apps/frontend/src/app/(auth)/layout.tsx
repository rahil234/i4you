import type React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth/verify-token';
import GoogleProviderWrapper from '@/app/(auth)/google-provider';

export default async function AuthLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const accessToken = cookieStore.get('accessToken')?.value;

  if (refreshToken || accessToken) {
    redirect('/discover');
  }

  return (
    <GoogleProviderWrapper>
      <div className="min-h-screen  bg-background">{children}</div>
    </GoogleProviderWrapper>
  );
}
