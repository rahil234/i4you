"use client"
import {UserLayout} from "@/components/user-layout"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Settings, Heart, Calendar, LogOut, Edit, Plus} from "lucide-react"
import {useAuthStore} from "@/store/authStore";

export default function ProfilePage() {
    const user = {
        name: "John Doe",
        age: 30,
        location: "New York, NY",
        bio: "Software developer who loves hiking and photography. Looking for someone who shares my passion for adventure and technology.",
        interests: ["Hiking", "Photography", "Coding", "Travel", "Coffee"],
        photos: [
            "/placeholder.svg?height=200&width=200",
            "/placeholder.svg?height=200&width=200",
            "/placeholder.svg?height=200&width=200",
            "/placeholder.svg?height=200&width=200",
        ],
        stats: {
            likes: 24,
            matches: 12,
            daysActive: 30,
        },
    }

    const {user: user2, isLoading, logout} = useAuthStore()

    const handleLogout = async () => {
        await logout()
    }

    if (isLoading) {
        return <div>Loading...</div>
    }


    return (
        <UserLayout>
            <div className="max-w-lg mx-auto pb-20 pt-6 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4"/>
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center mb-6">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name}/>
                                <AvatarFallback>
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>

                            <h2 className="text-xl font-bold">
                                {user.name}, {user.age}
                            </h2>
                            <p className="text-muted-foreground">{user.location}</p>

                            <Button variant="outline" size="sm" className="mt-2">
                                <Edit className="h-3 w-3 mr-2"/>
                                Edit Profile
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">About Me</h3>
                                <p className="text-sm text-muted-foreground">{user.bio}</p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map((interest, index) => (
                                        <span key={index}
                                              className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-full">
                      {interest}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">My Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            {user.photos.map((photo, index) => (
                                <div key={index}
                                     className="aspect-square relative rounded-md overflow-hidden bg-slate-100">
                                    <img
                                        src={photo || "/placeholder.svg"}
                                        alt={`Photo ${index + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                            <Button variant="outline"
                                    className="aspect-square flex flex-col items-center justify-center">
                                <Plus className="h-6 w-6 mb-1"/>
                                <span className="text-xs">Add Photo</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center">
                                <div className="bg-slate-100 rounded-full p-3 mb-2">
                                    <Heart className="h-5 w-5 text-teal-500"/>
                                </div>
                                <span className="text-lg font-bold">{user.stats.likes}</span>
                                <span className="text-xs text-muted-foreground">Likes</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-slate-100 rounded-full p-3 mb-2">
                                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500"/>
                                </div>
                                <span className="text-lg font-bold">{user.stats.matches}</span>
                                <span className="text-xs text-muted-foreground">Matches</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-slate-100 rounded-full p-3 mb-2">
                                    <Calendar className="h-5 w-5 text-blue-500"/>
                                </div>
                                <span className="text-lg font-bold">{user.stats.daysActive}</span>
                                <span className="text-xs text-muted-foreground">Days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2"/>
                    Sign Out
                </Button>
            </div>
        </UserLayout>
    )
}
