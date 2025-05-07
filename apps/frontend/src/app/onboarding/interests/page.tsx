"use client"

import { useOnboardingStore } from "@/store/onboardingStore"
import { OnboardingLayout } from "@/components/onboarding-layout"

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
  const { data, setInterests } = useOnboardingStore()
  const selectedInterests = data.interests

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      if (selectedInterests.length < 12) {
        setInterests([...selectedInterests, interest])
      }
    }
  }

  return (
    <OnboardingLayout currentStep="interests">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your interests</h1>
        <p className="text-muted-foreground mb-2">Select min of 5 interests to help us find your perfect match</p>
        <p className="text-sm text-primary mb-6">{selectedInterests.length}/12 selected</p>

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
                      selectedInterests.includes(interest) ? "bg-primary text-white" : "bg-muted hover:bg-muted/20"
                    }`}
                    disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 12}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  )
}
