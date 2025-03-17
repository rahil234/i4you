"use client"

import { useState } from "react"
import { UserLayout } from "@/components/user-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle } from "lucide-react"
import Link from "next/link"

// Sample data for matched users
const matchedUsers = [
  {
    id: "user1",
    name: "Jessica",
    age: 28,
    location: "New York",
    matchedOn: "2 days ago",
    avatar: "/placeholder.svg?height=60&width=60",
    initials: "JP",
  },
  {
    id: "user2",
    name: "Michael",
    age: 32,
    location: "Boston",
    matchedOn: "1 week ago",
    avatar: "/placeholder.svg?height=60&width=60",
    initials: "MC",
  },
  {
    id: "user3",
    name: "Sophia",
    age: 26,
    location: "Chicago",
    matchedOn: "3 days ago",
    avatar: "/placeholder.svg?height=60&width=60",
    initials: "SR",
  },
  {
    id: "user4",
    name: "David",
    age: 31,
    location: "Los Angeles",
    matchedOn: "1 day ago",
    avatar: "/placeholder.svg?height=60&width=60",
    initials: "DW",
  },
  {
    id: "user5",
    name: "Emma",
    age: 27,
    location: "Seattle",
    matchedOn: "5 days ago",
    avatar: "/placeholder.svg?height=60&width=60",
    initials: "ET",
  },
]

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMatches = matchedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <UserLayout>
      <div className="max-w-lg mx-auto pb-20 pt-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Your Matches</h1>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search matches..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">
                      {user.name}, {user.age}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.location}</p>
                    <p className="text-xs text-muted-foreground">Matched {user.matchedOn}</p>
                  </div>
                </div>

                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" asChild>
                  <Link href={`/messages/${user.id}`}>
                    <MessageCircle className="h-5 w-5 text-teal-500" />
                    <span className="sr-only">Message</span>
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}

