'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function OnboardingComplete() {
  const router = useRouter();
  const { submitOnboarding } = useOnboardingStore();

  useEffect(() => {
    const submit = async () => {
      await submitOnboarding();
    };
    submit();
  }, [submitOnboarding]);

  const handleContinue = () => {
    router.push('/discover');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="tinder-gradient p-6 rounded-full mb-6">
        <Check className="h-16 w-16 text-white" />
      </div>

      <h1 className="text-4xl font-bold mb-4">Profile Complete!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Your profile has been set up successfully. You're now ready to start matching!
      </p>

      <Button
        onClick={handleContinue}
        className="tinder-gradient hover:opacity-90 transition-opacity py-6 px-8 text-lg"
      >
        Start Matching
      </Button>
    </div>
  );
}
