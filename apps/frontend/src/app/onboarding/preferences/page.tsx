"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"
import { usePreferencesStore } from "@/store"

export default function OnboardingPreferences() {
  const router = useRouter()
  const { preferences, updatePreferences } = usePreferencesStore()

  const [gender, setGender] = useState<"male" | "female" | "all">(preferences.showMe)
  const [lookingFor, setLookingFor] = useState<"casual" | "relationship" | "friendship" | "all">(preferences.lookingFor)
  const [ageRange, setAgeRange] = useState<[number, number]>(preferences.ageRange)
  const [distance, setDistance] = useState<number>(preferences.distance)

  const handleNext = () => {
    updatePreferences({
      showMe: gender,
      lookingFor,
      ageRange,
      distance,
    })

    router.push("/onboarding/location")
  }

  const handleBack = () => {
    router.push("/onboarding/interests")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingProgress step={4} totalSteps={5} />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Your preferences</h1>
          <p className="text-muted-foreground mb-6">Tell us what you're looking for to help find your perfect match</p>

          <div className="space-y-8">
            <div className="space-y-3">
              <Label>Show me</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as "male" | "female" | "all")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Women</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Men</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Everyone</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Looking for</Label>
              <RadioGroup
                value={lookingFor}
                onValueChange={(value) => setLookingFor(value as "casual" | "relationship" | "friendship" | "all")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="casual" />
                  <Label htmlFor="casual">Casual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relationship" id="relationship" />
                  <Label htmlFor="relationship">Relationship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friendship" id="friendship" />
                  <Label htmlFor="friendship">Friendship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-types" />
                  <Label htmlFor="all-types">All of the above</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Age range</Label>
                <span className="text-sm text-muted-foreground">
                  {ageRange[0]} - {ageRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={ageRange}
                min={18}
                max={100}
                step={1}
                onValueChange={(value) => setAgeRange(value as [number, number])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Maximum distance</Label>
                <span className="text-sm text-muted-foreground">{distance} miles</span>
              </div>
              <Slider
                defaultValue={[distance]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setDistance(value[0])}
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button onClick={handleNext} className="i4you-gradient hover:opacity-90 transition-opacity">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

