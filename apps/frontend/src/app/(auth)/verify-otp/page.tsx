'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flame, Loader2 } from 'lucide-react';
import { OTPInput } from '@/components/ui/otp-input';
import { ThemeToggle } from '@/components/theme-toggle';

export default function VerifyOTPPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push('/login-with-otp');
    }
  }, [searchParams, router]);

  const handleVerifyOTP = async (otp: string) => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {

      setSuccess('OTP verified successfully!');

      // Redirect to user dashboard
      setTimeout(() => {
        router.push('/user-dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {

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
          <h1 className="text-3xl font-bold">Verify OTP</h1>
          <p className="mt-2 text-muted-foreground">Enter the one-time password sent to {email || 'your email'}</p>
        </div>

        <div className="space-y-6">
          <OTPInput length={6} onComplete={handleVerifyOTP} disabled={isLoading} className="mb-4" />

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">{success}</div>}

          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

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
        </div>

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

