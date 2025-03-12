"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, MessageCircle, Info } from "lucide-react"
import Link from "next/link"
import { motion, type PanInfo, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  id: string
  name: string
  age: number
  location: string
  bio: string
  interests: string[]
  photos: string[]
  distance: string
  onSwipe?: (direction: "left" | "right") => void
}

export function UserProfileCard({
  id,
  name,
  age,
  location,
  bio,
  interests,
  photos,
  distance,
  onSwipe,
}: UserProfileProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  // Framer Motion setup for swipe
  const cardControls = useAnimation()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const cardOpacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])

  // Indicators for like/dislike based on swipe direction
  const likeOpacity = useTransform(x, [0, 125], [0, 1])
  const nopeOpacity = useTransform(x, [-125, 0], [1, 0])

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex((prev) => prev + 1)
    }
  }

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1)
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100

    if (info.offset.x > threshold) {
      // Swiped right - like
      cardControls
        .start({
          x: 500,
          opacity: 0,
          transition: { duration: 0.3 },
        })
        .then(() => {
          if (onSwipe) onSwipe("right")
        })
    } else if (info.offset.x < -threshold) {
      // Swiped left - dislike
      cardControls
        .start({
          x: -500,
          opacity: 0,
          transition: { duration: 0.3 },
        })
        .then(() => {
          if (onSwipe) onSwipe("left")
        })
    } else {
      // Return to center
      cardControls.start({
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      })
    }
  }

  const handleLike = () => {
    cardControls
      .start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      })
      .then(() => {
        if (onSwipe) onSwipe("right")
      })
  }

  const handleDislike = () => {
    cardControls
      .start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.3 },
      })
      .then(() => {
        if (onSwipe) onSwipe("left")
      })
  }

  const toggleInfo = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInfo(!showInfo)
  }

  return (
    <motion.div
      className="absolute w-full max-w-sm mx-auto"
      animate={cardControls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity: cardOpacity }}
    >
      <Card className="overflow-hidden shadow-xl rounded-xl border-0 h-[70vh] max-h-[600px] relative">
        {/* Like/Nope indicators */}
        <motion.div
          className="absolute top-10 right-5 z-10 transform rotate-[-30deg] border-4 border-green-500 rounded-lg px-4 py-1"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-500 font-extrabold text-3xl">LIKE</span>
        </motion.div>

        <motion.div
          className="absolute top-10 left-5 z-10 transform rotate-[30deg] border-4 border-red-500 rounded-lg px-4 py-1"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-red-500 font-extrabold text-3xl">NOPE</span>
        </motion.div>

        {/* Photo gallery */}
        <div className="relative h-full w-full bg-black">
          <img
            src={photos[currentPhotoIndex] || "/placeholder.svg"}
            alt={`${name}'s photo`}
            className="object-cover w-full h-full"
          />

          {/* Photo navigation */}
          <div className="absolute top-0 left-0 right-0 flex justify-between h-full">
            <div className="w-1/3 h-full cursor-pointer" onClick={prevPhoto}></div>
            <div className="w-1/3 h-full cursor-pointer" onClick={toggleInfo}></div>
            <div className="w-1/3 h-full cursor-pointer" onClick={nextPhoto}></div>
          </div>

          {/* Photo indicators */}
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-2">
            {photos.map((_, index) => (
              <div
                key={index}
                className={cn("h-1 flex-1 rounded-full", index === currentPhotoIndex ? "bg-white" : "bg-white/40")}
              />
            ))}
          </div>

          {/* Distance badge */}
          <div className="absolute top-4 left-4 bg-black/40 text-white px-2 py-1 rounded-full text-xs">{distance}</div>

          {/* User info overlay */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white transition-all duration-300",
              showInfo ? "h-3/4" : "h-auto",
            )}
          >
            <div className="flex items-end justify-between mb-2">
              <h3 className="text-2xl font-bold">
                {name}, {age}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                onClick={toggleInfo}
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-white/80 mb-2">{location}</p>

            {showInfo && (
              <div className="space-y-4 overflow-y-auto max-h-[calc(100%-80px)]">
                <p className="text-sm text-white/90">{bio}</p>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span key={index} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-red-300 bg-white hover:bg-red-50 hover:border-red-500 shadow-lg"
          onClick={handleDislike}
        >
          <X className="h-8 w-8 text-red-500" />
          <span className="sr-only">Dislike</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-500 shadow-lg"
          asChild
        >
          <Link href={`/messages/${id}`}>
            <MessageCircle className="h-6 w-6 text-blue-500" />
            <span className="sr-only">Message</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-green-300 bg-white hover:bg-green-50 hover:border-green-500 shadow-lg"
          onClick={handleLike}
        >
          <Heart className="h-8 w-8 text-green-500" />
          <span className="sr-only">Like</span>
        </Button>
      </div>
    </motion.div>
  )
}

