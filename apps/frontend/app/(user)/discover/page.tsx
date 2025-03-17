"use client"

import { useState, useEffect } from "react"
import { UserProfileCard } from "@/components/user-profile-card"
import { UserLayout } from "@/components/user-layout"
import { AnimatePresence } from "framer-motion"

// Sample data for users
const sampleUsers = [
  {
    id: "user1",
    name: "Jessica",
    age: 28,
    location: "New York",
    bio: "Adventure seeker, coffee enthusiast, and amateur photographer. Love hiking and exploring new places.",
    interests: ["Travel", "Photography", "Hiking", "Coffee"],
    photos: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    distance: "5 miles away",
  },
  {
    id: "user2",
    name: "Michael",
    age: 32,
    location: "Boston",
    bio: "Software developer by day, musician by night. Looking for someone to share my passion for music and technology.",
    interests: ["Music", "Coding", "Concerts", "Reading"],
    photos: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    distance: "8 miles away",
  },
  {
    id: "user3",
    name: "Sophia",
    age: 26,
    location: "Chicago",
    bio: "Art lover and yoga instructor. I enjoy quiet evenings with a good book or an interesting conversation.",
    interests: ["Art", "Yoga", "Reading", "Meditation"],
    photos: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    distance: "3 miles away",
  },
  {
    id: "user4",
    name: "David",
    age: 31,
    location: "Los Angeles",
    bio: "Fitness enthusiast and foodie. I love trying new restaurants and staying active.",
    interests: ["Fitness", "Food", "Travel", "Movies"],
    photos: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    distance: "12 miles away",
  },
  {
    id: "user5",
    name: "Emma",
    age: 27,
    location: "Seattle",
    bio: "Book lover, cat person, and aspiring chef. Looking for someone to share cozy evenings and culinary adventures.",
    interests: ["Cooking", "Reading", "Cats", "Wine"],
    photos: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    distance: "7 miles away",
  },
]

export default function DiscoverPage() {
  const [users, setUsers] = useState([...sampleUsers])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchAnimation, setMatchAnimation] = useState(false)
  const [lastAction, setLastAction] = useState<"like" | "dislike" | null>(null)

  const handleSwipe = (direction: "left" | "right") => {
    // If it's a right swipe (like), show match animation with 20% probability
    if (direction === "right" && Math.random() < 0.2) {
      setMatchAnimation(true)
      setLastAction("like")
    } else {
      setLastAction(direction === "right" ? "like" : "dislike")
      moveToNextProfile()
    }
  }

  const moveToNextProfile = () => {
    setCurrentIndex((prevIndex) => {
      // If we've reached the end, reset the users
      if (prevIndex >= users.length - 1) {
        setTimeout(() => {
          setUsers([...sampleUsers])
          return 0
        }, 300)
        return prevIndex
      }
      return prevIndex + 1
    })
  }

  const closeMatchAnimation = () => {
    setMatchAnimation(false)
    moveToNextProfile()
  }

  // Reset users when they're all swiped
  useEffect(() => {
    if (currentIndex >= users.length) {
      setUsers([...sampleUsers])
      setCurrentIndex(0)
    }
  }, [currentIndex, users.length])

  return (
    <UserLayout>
      <div className="flex flex-col items-center max-w-md mx-auto pb-20 pt-4 px-4 min-h-[calc(100vh-64px)]">
        <div className="w-full mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Discover</h1>
        </div>

        <div className="relative w-full h-[calc(100vh-200px)] flex items-center justify-center">
          <AnimatePresence>
            {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
              <UserProfileCard
                key={`${user.id}-${currentIndex + index}`}
                id={user.id}
                name={user.name}
                age={user.age}
                location={user.location}
                bio={user.bio}
                interests={user.interests}
                photos={user.photos}
                distance={user.distance}
                onSwipe={index === 0 ? handleSwipe : undefined}
              />
            ))}
          </AnimatePresence>

          {users.length === 0 || currentIndex >= users.length ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
              <p className="text-gray-500">Check back later for more matches</p>
            </div>
          ) : null}
        </div>

        {/* Match animation */}
        {matchAnimation && (
          <div
            className="fixed inset-0 bg-gradient-to-b from-pink-500 to-red-500 flex flex-col items-center justify-center z-50"
            onClick={closeMatchAnimation}
          >
            <div className="text-center p-8 animate-bounce">
              <h2 className="text-4xl font-bold text-white mb-4">It's a Match!</h2>
              <p className="text-xl text-white mb-8">You and {users[currentIndex]?.name} liked each other</p>
              <div className="flex justify-center gap-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src="/placeholder.svg?height=96&width=96"
                    alt="Your profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={users[currentIndex]?.photos[0] || "/placeholder.svg"}
                    alt={users[currentIndex]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-8">
                <button
                  className="bg-white text-pink-500 px-8 py-3 rounded-full font-semibold shadow-lg"
                  onClick={closeMatchAnimation}
                >
                  Send a Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}

