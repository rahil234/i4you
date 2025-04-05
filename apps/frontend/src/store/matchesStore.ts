import type {Match, User} from "@/types";
import {create} from "zustand/index";
import {devtools} from "zustand/middleware";

interface MatchesStore {
    matches: Match[]
    potentialMatches: User[]
    loading: boolean
    error: string | null
    fetchMatches: () => Promise<void>
    fetchPotentialMatches: () => Promise<void>
    likeUser: (userId: string) => Promise<Match | null>
    dislikeUser: (userId: string) => Promise<void>
    unmatchUser: (matchId: string) => Promise<void>
}

export const useMatchesStore = create<MatchesStore>()(devtools(
    (set, get) => ({
        matches: [],
        potentialMatches: [],
        loading: false,
        error: null,

        fetchMatches: async () => {
            set({loading: true, error: null})
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const sampleMatches: Match[] = [
                    {
                        id: "match1",
                        userId: "user1",
                        matchedUserId: "user2",
                        createdAt: new Date().toISOString(),
                        user: {
                            id: "user2",
                            name: "Jessica Parker",
                            age: 28,
                            bio: "Adventure seeker, coffee enthusiast",
                            photos: ["/placeholder.svg?height=500&width=400"],
                            location: "New York",
                        },
                    },
                    {
                        id: "match2",
                        userId: "user1",
                        matchedUserId: "user3",
                        createdAt: new Date().toISOString(),
                        user: {
                            id: "user3",
                            name: "Michael Chen",
                            age: 32,
                            bio: "Software developer by day, musician by night",
                            photos: ["/placeholder.svg?height=500&width=400"],
                            location: "Boston",
                        },
                    },
                ]

                set({matches: sampleMatches, loading: false})
            } catch (error) {
                set({error: "Failed to fetch matches", loading: false})
            }
        },

        fetchPotentialMatches: async () => {
            set({loading: true, error: null})
            try {
                // In a real app, this would be an API call
                // For demo purposes, we'll use sample data
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const sampleUsers: User[] = [
                    {
                        id: "user4",
                        name: "Sophia",
                        age: 26,
                        bio: "Art lover and yoga instructor",
                        photos: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
                        location: "Chicago",
                        distance: "3 miles away",
                        interests: ["Art", "Yoga", "Reading", "Meditation"],
                    },
                    {
                        id: "user5",
                        name: "David",
                        age: 31,
                        bio: "Fitness enthusiast and foodie",
                        photos: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
                        location: "Los Angeles",
                        distance: "12 miles away",
                        interests: ["Fitness", "Food", "Travel", "Movies"],
                    },
                    {
                        id: "user6",
                        name: "Emma",
                        age: 27,
                        bio: "Book lover, cat person, and aspiring chef",
                        photos: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
                        location: "Seattle",
                        distance: "7 miles away",
                        interests: ["Cooking", "Reading", "Cats", "Wine"],
                    },
                ]

                set({potentialMatches: sampleUsers, loading: false})
            } catch (error) {
                set({error: "Failed to fetch potential matches", loading: false})
            }
        },

        likeUser: async (userId) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))

                const isMatch = Math.random() < 0.2

                if (isMatch) {
                    const matchedUser = get().potentialMatches.find((user) => user.id === userId)

                    if (!matchedUser) return null

                    const newMatch: Match = {
                        id: `match-${Date.now()}`,
                        userId: "user1", // Current user ID
                        matchedUserId: userId,
                        createdAt: new Date().toISOString(),
                        user: matchedUser,
                    }

                    set((state) => ({
                        matches: [...state.matches, newMatch],
                        potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
                    }))

                    return newMatch
                } else {
                    set((state) => ({
                        potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
                    }))

                    return null
                }
            } catch (error) {
                set({error: "Failed to like user"})
                return null
            }
        },

        dislikeUser: async (userId) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))

                set((state) => ({
                    potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
                }))
            } catch (error) {
                set({error: "Failed to dislike user"})
            }
        },

        unmatchUser: async (matchId) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))

                set((state) => ({
                    matches: state.matches.filter((match) => match.id !== matchId),
                }))
            } catch (error) {
                set({error: "Failed to unmatch user"})
            }
        },
    })
))

export default useMatchesStore
