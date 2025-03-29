"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, MapPin, Check } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function OnboardingLocation() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  const handleFinish = () => {
    router.push("/discover")
  }

  const handleBack = () => {
    router.push("/onboarding/preferences")
  }

  const handleUseCurrentLocation = () => {
    setIsLocating(true)

    // Simulate geolocation
    setTimeout(() => {
      setLocation("New York, NY")
      setIsLocating(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingProgress step={5} totalSteps={5} />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Your location</h1>
          <p className="text-muted-foreground mb-6">Set your location to help us find people near you</p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleUseCurrentLocation} disabled={isLocating}>
                  {isLocating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleFinish}
              className="i4you-gradient hover:opacity-90 transition-opacity"
              disabled={!location}
            >
              Finish
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

