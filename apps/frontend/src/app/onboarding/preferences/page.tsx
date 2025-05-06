"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboardingStore } from "@/store/onboardingStore"

export default function OnboardingPreferences() {
  const { data, updatePreferences } = useOnboardingStore()
  const { preferences } = data

  return (
    <OnboardingLayout currentStep="preferences">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your preferences</h1>
        <p className="text-muted-foreground mb-6">Tell us what you're looking for to help find your perfect match</p>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label>Show me</Label>
            <RadioGroup
              value={preferences.showMe}
              onValueChange={(value) => updatePreferences({ showMe: value as "male" | "female" | "all" })}
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
              value={preferences.lookingFor}
              onValueChange={(value) =>
                updatePreferences({ lookingFor: value as "casual" | "relationship" | "friendship" | "all" })
              }
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
                {preferences.ageRange[0]} - {preferences.ageRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={preferences.ageRange}
              min={18}
              max={100}
              step={1}
              onValueChange={(value) => updatePreferences({ ageRange: value as [number, number] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Maximum distance</Label>
              <span className="text-sm text-muted-foreground">{preferences.distance} killometers</span>
            </div>
            <Slider
              defaultValue={[preferences.distance]}
              min={1}
              max={100}
              step={1}
              onValueChange={(value) => updatePreferences({ distance: value[0] })}
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
