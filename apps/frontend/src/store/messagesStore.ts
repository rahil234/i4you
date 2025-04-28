import type {Message} from "@/types";
import {create} from "zustand/index";
import {useMatchesStore} from "@/store/matchesStore";

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

export default useMessagesStore;
