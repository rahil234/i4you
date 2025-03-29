import {create} from "zustand"
import {persist} from "zustand/middleware"
import type {User, UserPreferences, Match, Message, AuthState} from "@/types"
import auth from "@/services/auth";
import {devtools} from 'zustand/middleware';

interface AuthStore extends AuthState {
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    clearState: () => Promise<void>
    refreshToken: () => Promise<string>
    fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(devtools(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            signUpError: null,

            login: async (email, password) => {
                set({isLoading: true, error: null})
                const {data, error} = await auth.login(email, password);

                if (error) {
                    set({error: error, isLoading: false});
                    return;
                }

                const {user, token: accessToken} = data;

                set({
                    user,
                    accessToken,
                    isAuthenticated: true,
                    isLoading: false,
                })
            },

            register: async (name: string, email: string, password: string) => {
                set({isLoading: true, signUpError: null})
                const {data, error} = await auth.register(name, email, password);

                if (error) {
                    set({signUpError: error, isLoading: false});
                    return;
                }

                console.log("signup data", data)

                const {user, token: accessToken} = data;

                set({
                    user,
                    accessToken,
                    isAuthenticated: true,
                    isLoading: false,
                })
            },

            logout: async () => {

                await auth.logout()

                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                })

                await useAuthStore.getState().clearState()
                console.log("Logged out")
            },

            refreshToken: async () => {
                set({isLoading: true, error: null})

                const {data, error} = await auth.refreshToken()

                if (error) {
                    set({error: error, isLoading: false});
                    await useAuthStore.getState().logout();
                    return error
                }

                const {token} = data

                set({accessToken: token, isLoading: false});
                return token
            },

            clearState: async () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    signUpError: null,
                })
            },

            fetchUser: async () => {
                const {data, error} = await auth.getUser();
                if (error) {
                    set({error: error, isLoading: false});
                    return;
                }
                set({user: data.user})
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
))

interface PreferencesStore {
    preferences: UserPreferences
    updatePreferences: (preferences: Partial<UserPreferences>) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
    persist(
        (set, get) => ({
            preferences: {
                ageRange: [18, 35],
                distance: 25,
                gender: "all",
                showMe: "all",
                lookingFor: "relationship",
            },

            updatePreferences: (newPreferences) => {
                set((state) => ({
                    preferences: {...state.preferences, ...newPreferences},
                }))
            },

            savePreferences: async () => {
                console.log("Saving preferences", get().preferences)
            }
        }),
        {
            name: "preferences-storage",
        },
    ),
)

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

interface MessagesStore {
    messages: Record<string, Message[]>
    loading: boolean
    error: string | null
    sendMessage: (matchId: string, content: string) => Promise<void>
    fetchMessages: (matchId: string) => Promise<void>
}

export const useMessagesStore = create<MessagesStore>()((set, get) => ({
    messages: {},
    loading: false,
    error: null,

    sendMessage: async (matchId, content) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500))

            const newMessage: Message = {
                id: `msg-${Date.now()}`,
                matchId,
                senderId: "user1", // Current user ID
                content,
                createdAt: new Date().toISOString(),
                status: "sent",
            }

            set((state) => {
                const matchMessages = [...(state.messages[matchId] || []), newMessage]
                return {
                    messages: {
                        ...state.messages,
                        [matchId]: matchMessages,
                    },
                }
            })

            setTimeout(() => {
                set((state) => {
                    const updatedMessages = state.messages[matchId].map((msg) =>
                        msg.id === newMessage.id ? {...msg, status: "delivered" as "delivered"} : msg,
                    )

                    return {
                        messages: {
                            ...state.messages,
                            [matchId]: updatedMessages,
                        },
                    }
                })

                if (Math.random()) {
                    setTimeout(
                        () => {
                            const replies = [
                                "That sounds great!",
                                "I'll think about it and let you know.",
                                "Yes, I'd love to!",
                                "Sorry, I'm busy that day.",
                                "Interesting! Tell me more.",
                                "I was just thinking the same thing!",
                                "Haha, that's funny!",
                                "I miss you too!",
                                "Can we talk about this later?",
                                "I'm not sure I understand.",
                            ]

                            const replyContent = replies[Math.floor(Math.random() * replies.length)]

                            const match = useMatchesStore.getState().matches.find((m) => m.id === matchId)

                            if (!match) return

                            const replyMessage: Message = {
                                id: `msg-${Date.now()}`,
                                matchId,
                                senderId: match.matchedUserId,
                                content: replyContent,
                                createdAt: new Date().toISOString(),
                                status: "delivered",
                            }

                            set((state) => {
                                const matchMessages = [...(state.messages[matchId] || []), replyMessage]
                                return {
                                    messages: {
                                        ...state.messages,
                                        [matchId]: matchMessages,
                                    },
                                }
                            })
                        },
                        2000 + Math.random() * 5000,
                    )
                }
            }, 1000)
        } catch (error) {
            set({error: "Failed to send message"})
        }
    },

    fetchMessages: async (matchId) => {
        set({loading: true, error: null})
        try {
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // If we already have messages for this match, don't fetch again
            if (get().messages[matchId]?.length > 0) {
                set({loading: false})
                return
            }

            const sampleMessages: Message[] = [
                {
                    id: `msg-${Date.now() - 10000}`,
                    matchId,
                    senderId: "user1", // Current user ID
                    content: "Hey there! How are you?",
                    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    status: "read",
                },
                {
                    id: `msg-${Date.now() - 9000}`,
                    matchId,
                    senderId: matchId === "match1" ? "user2" : "user3",
                    content: "I'm good! Just got back from work. How about you?",
                    createdAt: new Date(Date.now() - 3500000).toISOString(),
                    status: "read",
                },
                {
                    id: `msg-${Date.now() - 8000}`,
                    matchId,
                    senderId: "user1",
                    content: "Doing well! Would you like to grab coffee sometime?",
                    createdAt: new Date(Date.now() - 3400000).toISOString(),
                    status: "read",
                },
            ]

            set((state) => ({
                messages: {
                    ...state.messages,
                    [matchId]: sampleMessages,
                },
                loading: false,
            }))
        } catch (error) {
            set({error: "Failed to fetch messages", loading: false})
        }
    },
}))
