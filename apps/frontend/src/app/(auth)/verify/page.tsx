'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Flame, Loader2 } from 'lucide-react';
import AuthService from '@/services/auth.service';
import { ThemeToggle } from '@/components/theme-toggle';

export default function VerifyAccountPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="i4you-gradient p-4 rounded-full">
                <Flame className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Invalid Link</h1>
            <p className="mt-2 text-muted-foreground">Verification token is missing or invalid</p>
          </div>

          <div className="text-center mt-6">
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await AuthService.verifyAccount(password, token);

    if (error) {
      setError(error || 'Verification failed');
      setIsLoading(false);
      return;
    }

    setSuccess('Account verified successfully! You can now login.');
    setIsLoading(false);

    setTimeout(() => {
      router.push('/onboarding');
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="i4you-gradient p-4 rounded-full">
              <Flame className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Verify Account</h1>
          <p className="mt-2 text-muted-foreground">Complete your email verification.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="py-6"
            />
            <p className="text-xs text-muted-foreground">Enter the password you used to register.</p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          {success && <div className="rounded-md bg-green-100 p-3 text-sm text-green-600">{success}</div>}

          <Button
            className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify and Set Password'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
