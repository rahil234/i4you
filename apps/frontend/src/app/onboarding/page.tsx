'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import useOnboardingStore from '@/store/onboardingStore';
import { useEffect } from 'react';

export default function OnboardingStart() {
  const router = useRouter();

  const { currentStep, completedSteps } = useOnboardingStore();

  useEffect(() => {
    console.log(completedSteps.photos);
    console.log(currentStep);
    if (completedSteps.photos) {
      router.push(`/onboarding/${currentStep}`);
    }
  }, [completedSteps.photos, router]);

  const handleStart = () => {
    router.push('/onboarding/photos');
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="i4you-gradient p-6 rounded-full mb-6">
        <Flame className="h-16 w-16 text-white" />
      </div>

      <h1 className="text-4xl font-bold mb-4">Welcome to i4you</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Let's set up your profile to help you find the perfect match
      </p>

      <Button onClick={handleStart} className="i4you-gradient hover:opacity-90 transition-opacity py-6 px-8 text-lg">
        Get Started
      </Button>
    </div>
  );
}
