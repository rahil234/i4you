import React from 'react';
import { Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cookies } from 'next/headers';
import auth from '@/services/auth';
import { redirect } from 'next/navigation';

export default async function UserLayout(
  { children }: Readonly<{ children: React.ReactNode }>,
) {

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  console.log('refreshToken', refreshToken);

  if (!refreshToken) {
    redirect('/auth/login');
    return;
  }

  const { data, error } = await auth.refreshToken();

  if (error) {
    console.log('error', error);
    redirect('/auth/login');
  }

  console.log('data', data);

  if (true) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      {children}
    </div>
  );
}
