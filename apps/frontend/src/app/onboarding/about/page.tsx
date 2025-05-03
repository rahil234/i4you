"use client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboardingStore } from "@/store/onboardingStore"

export default function OnboardingAbout() {
  const { data, setName, setAge, setBio } = useOnboardingStore()
  const { name, age, bio } = data

  return (
    <OnboardingLayout currentStep="about">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">About you</h1>
        <p className="text-muted-foreground mb-6">Tell us a bit about yourself to help others get to know you</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="120"
              value={age || ""}
              onChange={(e) => setAge(Number.parseInt(e.target.value, 10) || 0)}
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
        </div>
      </div>
    </OnboardingLayout>
  )
}
