"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function OnboardingPhotos() {
  const router = useRouter()
  const [photos, setPhotos] = useState<string[]>(["/placeholder.svg?height=300&width=300"])

  const handleNext = () => {
    router.push("/onboarding/about")
  }

  const handleBack = () => {
    router.push("/onboarding")
  }

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just add a placeholder
    setPhotos([...photos, "/placeholder.svg?height=300&width=300"])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingProgress step={1} totalSteps={5} />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Add your photos</h1>
          <p className="text-muted-foreground mb-6">
            Add at least 2 photos to continue. Profiles with photos get more matches!
          </p>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden relative">
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Profile photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {photos.length < 6 && (
              <button
                onClick={handleAddPhoto}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="i4you-gradient hover:opacity-90 transition-opacity"
              disabled={photos.length < 1}
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

