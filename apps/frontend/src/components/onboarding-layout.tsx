'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useOnboardingStore, type OnboardingStep } from '@/store/onboarding-store';
import { LoadScript } from '@react-google-maps/api';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: OnboardingStep;
}

export function OnboardingLayout({ children, currentStep }: OnboardingLayoutProps) {
  const router = useRouter();
  const {
    currentStep: storeStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isStepValid,
  } = useOnboardingStore();

  useEffect(() => {
    if (currentStep !== storeStep) {
      setCurrentStep(currentStep);
    }
  }, [currentStep, storeStep, setCurrentStep]);

  const steps = ['photos', 'about', 'interests', 'preferences', 'location'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      nextStep();

      const nextStepIndex = steps.indexOf(currentStep) + 1;
      if (nextStepIndex < steps.length) {
        router.push(`/onboarding/${steps[nextStepIndex]}`);
      } else {
        router.push('/onboarding/complete');
      }
    }
  };

  const handleBack = () => {
    prevStep();
    const prevStepIndex = steps.indexOf(currentStep) - 1;
    if (prevStepIndex >= 0) {
      router.push(`/onboarding/${steps[prevStepIndex]}`);
    } else {
      router.push('/onboarding');
    }
  };

  const isCurrentStepValid = isStepValid(currentStep);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full py-4 px-4 border-b">
        <div className="w-full max-w-md mx-auto">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Step {currentIndex + 1} of {steps.length}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">{children}</div>

        <div className="p-4 border-t">
          <div className="w-full max-w-md mx-auto flex justify-between">
            {currentIndex > 0 ? (
              <Button variant="outline" onClick={handleBack} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              className="tinder-gradient hover:opacity-90 transition-opacity"
              disabled={isCurrentStepValid ? undefined : undefined}
            >
              {currentStep === 'location' ? 'Complete' : 'Next'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
