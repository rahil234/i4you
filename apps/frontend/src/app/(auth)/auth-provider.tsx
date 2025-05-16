'use client';

import { FacebookProvider } from 'react-facebook';
import { GoogleOAuthProvider } from '@react-oauth/google';
import type React from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const facebookClientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!;

  if (!googleClientId || !facebookClientId) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID or NEXT_PUBLIC_FACEBOOK_CLIENT_ID is not defined');

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <FacebookProvider appId={facebookClientId}>
        {children}
      </FacebookProvider>
    </GoogleOAuthProvider>
  );
};