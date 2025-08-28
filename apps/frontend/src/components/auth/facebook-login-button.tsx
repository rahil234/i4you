'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { LoginButton } from 'react-facebook';
import { FaFacebookF } from 'react-icons/fa6';
import useAuthStore from '@/store/auth-store';

const FBButton = () => {
  return (
    <div
      className="w-full py-3 rounded-md relative border border-input bg-background hover:bg-accent hover:text-accent-foreground">
      <FaFacebookF className="size-5 absolute left-4 text-blue-600" />
      <span>Continue with Facebook</span>
    </div>
  );
};

export default function FacebookLoginButton({ type }: { type: 'signup' | 'login' }) {
  const router = useRouter();

  const { facebookAuthLogin, facebookAuthRegister, isLoading, error } = useAuthStore();

  return (
    <LoginButton
      children={<FBButton />}
      scope="public_profile"
      onSuccess={async (res) => {
        if (res.status === 'connected') {
          const { accessToken } = res.authResponse;
          if (type === 'signup') {
            await facebookAuthRegister(accessToken);
          } else {
            await facebookAuthLogin(accessToken);
          }

          if (error) {
            console.error('Error logging in with Facebook:', error);
            return;
          }
          router.push('/discover');
        } else {
          console.warn('Facebook login not connected:', res.status);
        }
      }}
      onError={(error) => {
        console.error('Login Failed:', error);
      }}
      disabled={isLoading}
    />
  );
}
