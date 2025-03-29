"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function OnboardingAbout() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [bio, setBio] = useState("")

  const handleNext = () => {
    router.push("/onboarding/interests")
  }

  const handleBack = () => {
    router.push("/onboarding/photos")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingProgress step={2} totalSteps={5} />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">About you</h1>
          <p className="text-muted-foreground mb-6">Tell us a bit about yourself to help others get to know you</p>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
            </div>
          </form>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="i4you-gradient hover:opacity-90 transition-opacity"
              disabled={!name || !age}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

