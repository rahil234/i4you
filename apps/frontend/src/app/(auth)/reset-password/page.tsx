'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import AuthService from '@/services/auth.service';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Heart className="h-12 w-12 text-teal-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Error</CardTitle>
            <CardDescription>Invalid or missing token</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    const { error } = await AuthService.resetPassword(password, token);

    if (error) {
      setError(error || 'Failed to update password');
      return;
    }

    setSuccess('Password updated successfully! please login with your new password');
    setIsLoading(false);

    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-12 w-12 text-teal-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

              {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  'Reset Password'
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

