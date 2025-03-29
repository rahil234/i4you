import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      action: "joined the platform",
      time: "2 minutes ago",
      type: "new_user",
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        image: "/placeholder.svg?height=32&width=32",
        initials: "MC",
      },
      action: "reported a profile",
      time: "15 minutes ago",
      type: "report",
    },
    {
      id: 3,
      user: {
        name: "Jessica Williams",
        image: "/placeholder.svg?height=32&width=32",
        initials: "JW",
      },
      action: "upgraded to premium",
      time: "1 hour ago",
      type: "upgrade",
    },
    {
      id: 4,
      user: {
        name: "David Kim",
        image: "/placeholder.svg?height=32&width=32",
        initials: "DK",
      },
      action: "matched with 3 users",
      time: "2 hours ago",
      type: "match",
    },
    {
      id: 5,
      user: {
        name: "Emma Rodriguez",
        image: "/placeholder.svg?height=32&width=32",
        initials: "ER",
      },
      action: "updated profile photos",
      time: "3 hours ago",
      type: "update",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest user actions on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={activity.user.image} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.user.name}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    activity.type === "report"
                      ? "destructive"
                      : activity.type === "upgrade"
                        ? "default"
                        : activity.type === "match"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {activity.type.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

