import type React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function AuthLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {

  const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!NEXT_PUBLIC_GOOGLE_CLIENT_ID) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">{children}</div>
    </GoogleOAuthProvider>
  );
}
