"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Flag } from "lucide-react"

export function ModerationQueue() {
  const [items] = useState([
    {
      id: "1",
      user: {
        name: "Ryan Thompson",
        age: 28,
        avatar: "/placeholder.svg?height=80&width=80",
        initials: "RT",
      },
      type: "profile_photo",
      reason: "Potentially inappropriate content",
      date: "10 minutes ago",
      images: ["/placeholder.svg?height=200&width=150"],
    },
    {
      id: "2",
      user: {
        name: "Mia Rodriguez",
        age: 24,
        avatar: "/placeholder.svg?height=80&width=80",
        initials: "MR",
      },
      type: "bio_text",
      reason: "Potentially contains contact information",
      date: "25 minutes ago",
      text: "Looking for fun people to hang out with! Message me on IG: mia_rod24 or call me at 555-123-4567",
    },
    {
      id: "3",
      user: {
        name: "Tyler Jackson",
        age: 32,
        avatar: "/placeholder.svg?height=80&width=80",
        initials: "TJ",
      },
      type: "profile_photo",
      reason: "Potentially not the user",
      date: "45 minutes ago",
      images: ["/placeholder.svg?height=200&width=150"],
    },
    {
      id: "4",
      user: {
        name: "Sophia Chen",
        age: 26,
        avatar: "/placeholder.svg?height=80&width=80",
        initials: "SC",
      },
      type: "bio_text",
      reason: "Potentially offensive language",
      date: "1 hour ago",
      text: "Just looking for a good time. Not interested in time wasters or boring people. If you can't handle my attitude, swipe left!",
    },
  ])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback>{item.user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {item.user.name}, {item.user.age}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  {item.type.replace("_", " ")}
                </Badge>
              </div>

              <div className="rounded-md border p-3">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  <AlertTriangle className="mr-1 inline-block h-4 w-4" />
                  {item.reason}
                </p>

                {item.type === "profile_photo" && (
                  <div className="mt-2">
                    <img src={item.images[0] || "/placeholder.svg"} alt="Content for review" className="rounded-md" />
                  </div>
                )}

                {item.type === "bio_text" && (
                  <div className="mt-2 rounded-md bg-muted p-3">
                    <p className="text-sm">{item.text}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

