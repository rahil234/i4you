import type React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    redirect('/discover');
  }

  const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!NEXT_PUBLIC_GOOGLE_CLIENT_ID) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen  bg-background">{children}</div>
    </GoogleOAuthProvider>
  );
}
