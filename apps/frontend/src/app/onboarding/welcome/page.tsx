"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboardingStore } from "@/store/onboardingStore"

export default function OnboardingWelcome() {
  const router = useRouter()
  const { markStepCompleted } = useOnboardingStore()

  const handleStart = () => {
    markStepCompleted("welcome")
    router.push("/onboarding/photos")
  }

  return (
    <OnboardingLayout currentStep="welcome">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="tinder-gradient p-6 rounded-full mb-6">
          <Flame className="h-16 w-16 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Welcome to Tinder</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Let's set up your profile to help you find the perfect match
        </p>

        <Button onClick={handleStart} className="tinder-gradient hover:opacity-90 transition-opacity py-6 px-8 text-lg">
          Get Started
        </Button>
      </div>
    </OnboardingLayout>
  )
}
