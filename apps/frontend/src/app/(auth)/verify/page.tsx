'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Heart, Loader2 } from 'lucide-react';
import AuthService from '@/services/auth.service';

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Heart className="h-12 w-12 text-teal-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
            <CardDescription>Verification token is missing or invalid</CardDescription>
          </CardHeader>
        </Card>
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-12 w-12 text-teal-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Account</CardTitle>
          <CardDescription>Set a password to complete your verification</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Enter the password you used to register.</p>
              </div>

              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
              {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify and Set Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Link href="/login" className="text-teal-500 hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
