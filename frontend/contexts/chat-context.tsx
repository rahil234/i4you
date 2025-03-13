"use client"

import type React from "react"
import {createContext, useContext, useEffect, useState, useCallback} from "react"
import {getWebSocketClient} from "@/lib/websocket"

// Types for our chat context
interface Message {
    id: string
    chatId: string
    content: string
    sender: string
    timestamp: string
    status?: "sent" | "delivered" | "read"
}

interface User {
    id: string
    name: string
    avatar: string
    initials: string
    lastActive?: string
    isOnline?: boolean
}

interface Chat {
    id: string
    participants: User[]
    lastMessage?: Message
    unreadCount: number
}

interface ChatContextType {
    chats: Chat[]
    messages: Record<string, Message[]>
    currentUser: User | null
    connectionStatus: "connected" | "disconnected" | "error" | "connecting"
    sendMessage: (chatId: string, content: string) => void
    markAsRead: (chatId: string) => void
    isTyping: Record<string, boolean>
    startTyping: (chatId: string) => void
    stopTyping: (chatId: string) => void
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Sample data for testing
const sampleCurrentUser: User = {
    id: "current-user",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "YO",
    isOnline: true,
}

const sampleUsers: Record<string, User> = {
    user1: {
        id: "user1",
        name: "Jessica Parker",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JP",
        lastActive: "online",
        isOnline: true,
    },
    user2: {
        id: "user2",
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
        lastActive: "5 min ago",
        isOnline: false,
    },
    user3: {
        id: "user3",
        name: "Sophia Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SR",
        lastActive: "2 hours ago",
        isOnline: false,
    },
    user4: {
        id: "user4",
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DW",
        lastActive: "yesterday",
        isOnline: false,
    },
    user5: {
        id: "user5",
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "ET",
        lastActive: "3 days ago",
        isOnline: false,
    },
}

const sampleChats: Chat[] = [
    {
        id: "chat1",
        participants: [sampleCurrentUser, sampleUsers.user1],
        unreadCount: 2,
    },
    {
        id: "chat2",
        participants: [sampleCurrentUser, sampleUsers.user2],
        unreadCount: 0,
    },
    {
        id: "chat3",
        participants: [sampleCurrentUser, sampleUsers.user3],
        unreadCount: 1,
    },
    {
        id: "chat4",
        participants: [sampleCurrentUser, sampleUsers.user4],
        unreadCount: 0,
    },
    {
        id: "chat5",
        participants: [sampleCurrentUser, sampleUsers.user5],
        unreadCount: 0,
    },
]

const sampleMessages: Record<string, Message[]> = {
    chat1: [
        {
            id: "m1",
            chatId: "chat1",
            content: "Hey, how's it going?",
            sender: "user1",
            timestamp: "10:30 AM",
            status: "read",
        },
        {
            id: "m2",
            chatId: "chat1",
            content: "Hi! I'm doing great, thanks for asking. How about you?",
            sender: "current-user",
            timestamp: "10:32 AM",
            status: "read",
        },
        {
            id: "m3",
            chatId: "chat1",
            content: "I'm good too! Just checking out this new coffee shop downtown. Have you been there?",
            sender: "user1",
            timestamp: "10:34 AM",
            status: "read",
        },
        {
            id: "m4",
            chatId: "chat1",
            content: "No, I haven't had the chance yet. Is it any good?",
            sender: "current-user",
            timestamp: "10:36 AM",
            status: "read",
        },
        {
            id: "m5",
            chatId: "chat1",
            content: "It's amazing! They have the best lattes. We should go sometime!",
            sender: "user1",
            timestamp: "10:37 AM",
            status: "delivered",
        },
    ],
    chat2: [
        {
            id: "m1",
            chatId: "chat2",
            content: "Would you like to meet for coffee?",
            sender: "user2",
            timestamp: "Yesterday",
            status: "read",
        },
        {
            id: "m2",
            chatId: "chat2",
            content: "Sure, that sounds great! When were you thinking?",
            sender: "current-user",
            timestamp: "Yesterday",
            status: "read",
        },
    ],
    chat3: [
        {
            id: "m1",
            chatId: "chat3",
            content: "I found this great restaurant we could try next weekend.",
            sender: "current-user",
            timestamp: "2 days ago",
            status: "read",
        },
        {
            id: "m2",
            chatId: "chat3",
            content: "That sounds great! Let me know when.",
            sender: "user3",
            timestamp: "2 days ago",
            status: "read",
        },
        {
            id: "m3",
            chatId: "chat3",
            content: "How about Saturday at 7pm?",
            sender: "user3",
            timestamp: "1 hour ago",
            status: "delivered",
        },
    ],
    chat4: [
        {
            id: "m1",
            chatId: "chat4",
            content: "I had a really nice time yesterday.",
            sender: "user4",
            timestamp: "Yesterday",
            status: "read",
        },
        {
            id: "m2",
            chatId: "chat4",
            content: "Me too! We should do it again sometime.",
            sender: "current-user",
            timestamp: "Yesterday",
            status: "read",
        },
    ],
    chat5: [
        {
            id: "m1",
            chatId: "chat5",
            content: "Thanks for recommending that restaurant!",
            sender: "user5",
            timestamp: "2 days ago",
            status: "read",
        },
        {
            id: "m2",
            chatId: "chat5",
            content: "You're welcome! I'm glad you enjoyed it.",
            sender: "current-user",
            timestamp: "2 days ago",
            status: "read",
        },
    ],
}

// Create the provider component
export function ChatProvider({children}: { children: React.ReactNode }) {
    const [chats, setChats] = useState<Chat[]>(sampleChats)
    const [messages, setMessages] = useState<Record<string, Message[]>>(sampleMessages)
    const [currentUser] = useState<User>(sampleCurrentUser)
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "connecting">(
        "connecting",
    )
    const [isTyping, setIsTyping] = useState<Record<string, boolean>>({})

    // Initialize WebSocket connection
    useEffect(() => {
        const wsClient = getWebSocketClient()
        console.log(wsClient);

        // Set up message handler
        const messageHandler = wsClient.onMessage((message) => {
            if (message.type === "message") {
                // Handle new message
                const newMessage: Message = {
                    id: message.id,
                    chatId: message.chatId,
                    content: message.content,
                    sender: message.sender,
                    timestamp: message.timestamp,
                    status: "delivered",
                }

                setMessages((prev) => {
                    const chatMessages = [...(prev[message.chatId] || []), newMessage]
                    return {...prev, [message.chatId]: chatMessages}
                })

                // Update chat with last message
                setChats((prev) => {
                    return prev.map((chat) => {
                        if (chat.id === message.chatId) {
                            return {
                                ...chat,
                                lastMessage: newMessage,
                                unreadCount: chat.unreadCount + 1,
                            }
                        }
                        return chat
                    })
                })
            } else if (message.type === "typing") {
                // Handle typing indicator
                setIsTyping((prev) => ({
                    ...prev,
                    [message.chatId]: message.isTyping,
                }))
            } else if (message.type === "status") {
                // Handle user status changes (online/offline)
                // Update user status in chats
            }
        })

        // Set up status handler
        const statusHandler = wsClient.onStatusChange((status) => {
            setConnectionStatus(status)
        })

        // Connect to WebSocket server
        wsClient.connect("user1")

        // Clean up on unmount
        return () => {
            messageHandler()
            statusHandler()
            wsClient.disconnect()
        }
    }, [])

    // Send a message
    const sendMessage = useCallback(
        (chatId: string, content: string) => {
            if (!content.trim()) return

            // Create a new message
            const newMessage: Message = {
                id: `m${Date.now()}`,
                chatId,
                content,
                sender: currentUser.id,
                timestamp: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
                status: "sent",
            }

            // Update messages state
            setMessages((prev) => {
                const chatMessages = [...(prev[chatId] || []), newMessage]
                return {...prev, [chatId]: chatMessages}
            })

            // Update chat with last message
            setChats((prev) => {
                return prev.map((chat) => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            lastMessage: newMessage,
                        }
                    }
                    return chat
                })
            })

            // Send message via WebSocket
            const wsClient = getWebSocketClient()
            wsClient.sendMessage({
                receiver: "user1",
                message: content,
            })

            // Simulate message delivery and read status
            setTimeout(() => {
                setMessages((prev) => {
                    return {
                        ...prev,
                        [chatId]: prev[chatId].map((msg) => (msg.id === newMessage.id ? {
                            ...msg,
                            status: "delivered"
                        } : msg)),
                    }
                })

                // Simulate a reply after a random delay (for demo purposes)
                if (Math.random() > 0.5) {
                    const replyDelay = 1000 + Math.random() * 5000
                    setTimeout(() => {
                        // Show typing indicator
                        setIsTyping((prev) => ({...prev, [chatId]: true}))

                        // Hide typing indicator and send reply after a delay
                        setTimeout(
                            () => {
                                setIsTyping((prev) => ({...prev, [chatId]: false}))

                                const otherUser = chats.find((c) => c.id === chatId)?.participants.find((p) => p.id !== currentUser.id)
                                if (otherUser) {
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

                                    const replyMessage: Message = {
                                        id: `m${Date.now()}`,
                                        chatId,
                                        content: replyContent,
                                        sender: otherUser.id,
                                        timestamp: new Date().toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }),
                                        status: "delivered",
                                    }

                                    setMessages((prev) => {
                                        const chatMessages = [...(prev[chatId] || []), replyMessage]
                                        return {...prev, [chatId]: chatMessages}
                                    })

                                    setChats((prev) => {
                                        return prev.map((chat) => {
                                            if (chat.id === chatId) {
                                                return {
                                                    ...chat,
                                                    lastMessage: replyMessage,
                                                    unreadCount: chat.unreadCount + 1,
                                                }
                                            }
                                            return chat
                                        })
                                    })
                                }
                            },
                            1000 + Math.random() * 2000,
                        )
                    }, replyDelay)
                }
            }, 1000)
        },
        [chats, currentUser.id],
    )

    // Mark messages as read
    const markAsRead = useCallback(
        (chatId: string) => {
            setChats((prev) => {
                return prev.map((chat) => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            unreadCount: 0,
                        }
                    }
                    return chat
                })
            })

            setMessages((prev) => {
                if (!prev[chatId]) return prev

                return {
                    ...prev,
                    [chatId]: prev[chatId].map((msg) => (msg.sender !== currentUser.id ? {
                        ...msg,
                        status: "read"
                    } : msg)),
                }
            })

            // Send read receipt via WebSocket
            const wsClient = getWebSocketClient()
            wsClient.sendReadReceipt("user1", chatId)
        },
        [currentUser.id],
    )

    // Typing indicators
    const startTyping = useCallback((chatId: string) => {
        const wsClient = getWebSocketClient()
        wsClient.sendTyping("user1", chatId, true)
    }, [])

    const stopTyping = useCallback((chatId: string) => {
        const wsClient = getWebSocketClient()
        wsClient.sendTyping("user1", chatId, false)
    }, [])

    const value = {
        chats,
        messages,
        currentUser,
        connectionStatus,
        sendMessage,
        markAsRead,
        isTyping,
        startTyping,
        stopTyping,
    }

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// Create a hook to use the chat context
export function useChat() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider")
    }
    return context
}
