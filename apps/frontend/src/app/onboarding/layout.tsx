import type React from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { ThemeToggle } from '@/components/theme-toggle';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { getUserData } from '@/lib/auth/get-user-data';
import { redirect } from 'next/navigation';
import { LoadScript } from '@react-google-maps/api';

async function OnboardingRootLayout(
  { children }: Readonly<{ children: React.ReactNode }>) {

  const user = await getUserData();

  if (!user || !user.onboarding) {
    redirect('/');
  }

  return (
    <ThemeProvider>
      <AuthSessionHydrator user={user} />
      <div className="min-h-screen">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}

export default OnboardingRootLayout;
