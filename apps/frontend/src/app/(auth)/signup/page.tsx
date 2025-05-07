'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, Loader2, Facebook } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/store/authStore';
import GoogleLogo from '@/components/auth/google-logo';
import { useGoogleLogin } from '@react-oauth/google';
import { z } from 'zod';

// Define Zod schema for form validation
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupForm>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, googleAuthLogin, isLoading, error, signUpError } = useAuthStore();

  const resetState = () => {
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setSuccess(null);
    setIsSubmitted(false);
    setIsFormValid(false);
  };

  // Validate form
  const validateForm = () => {
    const result = signupSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const newErrors: Partial<Record<keyof SignupForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupForm;
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      validateForm();
      return;
    }

    await register(formData.name, formData.email, formData.password);

    if (!error && !signUpError) {
      resetState();
      setSuccess('Account created successfully! Please check your email for verification.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      console.log('Google Login Success:', res);
      await googleAuthLogin(res.access_token);
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
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted-foreground">Join i4you and start matching today</p>
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
              <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className={`py-6 ${errors.name && isSubmitted ? 'border-destructive' : ''}`}
            />
            {errors.name && isSubmitted && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className={`py-6 ${errors.password && isSubmitted ? 'border-destructive' : ''}`}
            />
            {errors.password && isSubmitted ? (
              <p className="text-sm text-destructive">{errors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            )}
          </div>

          {(signUpError || error) && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{signUpError || error}</div>
          )}

          {success && <div className="rounded-md bg-success/10 p-3 text-sm text-success">{success}</div>}

          <Button
            className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity"
            type="submit"
            disabled={isLoading || (isSubmitted && !isFormValid)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
