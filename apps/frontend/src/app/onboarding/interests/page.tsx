"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"

const interestCategories = [
  {
    name: "Lifestyle",
    interests: ["Travel", "Fitness", "Cooking", "Reading", "Photography", "Art", "Music", "Dancing", "Yoga", "Hiking"],
  },
  {
    name: "Sports",
    interests: [
      "Football",
      "Basketball",
      "Tennis",
      "Swimming",
      "Cycling",
      "Running",
      "Golf",
      "Volleyball",
      "Skiing",
      "Surfing",
    ],
  },
  {
    name: "Entertainment",
    interests: [
      "Movies",
      "TV Shows",
      "Gaming",
      "Concerts",
      "Theater",
      "Comedy",
      "Festivals",
      "Board Games",
      "Podcasts",
      "Anime",
    ],
  },
  {
    name: "Food & Drink",
    interests: ["Coffee", "Wine", "Foodie", "Vegan", "Craft Beer", "Brunch", "Baking", "BBQ", "Sushi", "Cocktails"],
  },
]

export default function OnboardingInterests() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const handleNext = () => {
    router.push("/onboarding/preferences")
  }

  const handleBack = () => {
    router.push("/onboarding/about")
  }

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest])
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingProgress step={3} totalSteps={5} />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Your interests</h1>
          <p className="text-muted-foreground mb-2">Select up to 5 interests to help us find your perfect match</p>
          <p className="text-sm text-primary mb-6">{selectedInterests.length}/5 selected</p>

          <div className="space-y-6">
            {interestCategories.map((category) => (
              <div key={category.name}>
                <h2 className="font-semibold mb-2">{category.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {category.interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedInterests.includes(interest) ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                      }`}
                      disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="i4you-gradient hover:opacity-90 transition-opacity"
              disabled={selectedInterests.length === 0}
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

