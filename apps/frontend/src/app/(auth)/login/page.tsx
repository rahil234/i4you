'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, Loader2, Facebook } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { ThemeToggle } from '@/components/theme-toggle';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleLogo from '@/components/auth/google-logo';
import { z } from 'zod';

// Define Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { login, googleAuthLogin, isLoading, error } = useAuthStore();

  // Validate form
  const validateForm = () => {
    const result = loginSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const newErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      setIsFormValid(false);
    }
  };

  // Validate only after submission or input changes post-submission
  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [formData, isSubmitted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      validateForm();
      return;
    }

    await login(formData.email, formData.password);
    if (!error)
      router.push('/discover');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      await googleAuthLogin(res.access_token);
      router.push('/discover');
    },
    onError: error => console.log('Login Failed:', error),
  });

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
          <h1 className="text-3xl font-bold">Sign in to i4you</h1>
          <p className="mt-2 text-muted-foreground">Welcome back! Please enter your details</p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full py-6 relative"
                  onClick={() => googleLogin()}
                  disabled={isLoading}
          >
            <GoogleLogo className="h-5 w-5 absolute left-4" />
            <span>Continue with Google</span>
          </Button>

          <Button variant="outline" className="w-full py-6 relative">
            <Facebook className="h-5 w-5 absolute left-4 text-blue-600" />
            <span>Continue with Facebook</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`py-6 ${errors.email && isSubmitted ? 'border-destructive' : ''}`}
            />
            {errors.email && isSubmitted && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className={`py-6 ${errors.password && isSubmitted ? 'border-destructive' : ''}`}
            />
            {errors.password && isSubmitted && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button
            type="submit"
            className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity"
            disabled={isLoading || (isSubmitted && !isFormValid)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

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