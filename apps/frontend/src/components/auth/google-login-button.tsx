'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '@/store/auth-store';

export default function GoogleLoginButton({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter();

  const { googleAuthLogin, googleAuthRegister, isLoading, error, signUpError } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      if (type === 'signup') {
        await googleAuthRegister(res.access_token);
      } else {
        await googleAuthLogin(res.access_token);
      }
      if (!error && !signUpError) {
        router.push('/discover');
      }
    },
    onError: error => console.log('Login Failed:', error),
  });

  return (
    <Button variant="outline" className="w-full py-6 relative transition-colors duration-0"
            onClick={() => googleLogin()}
            disabled={isLoading}
    >
      <FcGoogle className="size-6 absolute left-4" />
      <span>Continue with Google</span>
    </Button>
  );
}
