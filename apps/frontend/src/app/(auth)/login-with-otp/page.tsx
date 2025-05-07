'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginWithOTPPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      setSuccess('OTP sent to your email. Please check your inbox.');
      setShowOTPInput(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      // Redirect to the user dashboard on successful verification
      router.push('/user-dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // if (otpError) throw otpError

      setSuccess('New OTP sent to your email. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold">Sign in with OTP</h1>
          <p className="mt-2 text-muted-foreground">
            {showOTPInput
              ? 'Enter the one-time password sent to your email'
              : 'We\'ll send a one-time password to your email'}
          </p>
        </div>

        {!showOTPInput ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-6"
              />
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

            <Button
              className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="py-6"
              />
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

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
                'Verify OTP'
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-primary"
              >
                Didn't receive the code? Resend
              </Button>
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Sign in with password instead
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

