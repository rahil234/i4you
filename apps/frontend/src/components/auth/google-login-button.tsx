'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '@/store/authStore';

export default function GoogleLoginButton() {
  const router = useRouter();

  const { googleAuthLogin, isLoading, error } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      await googleAuthLogin(res.access_token);
      if (!error) {
        router.push('/discover');
      }
    },
    onError: error => console.log('Login Failed:', error),
  });

  return (
    <Button variant="outline" className="w-full py-6 relative"
            onClick={() => googleLogin()}
            disabled={isLoading}
    >
      <FcGoogle className="size-6 absolute left-4" />
      <span>Continue with Google</span>
    </Button>
  );
}
