"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "@/contexts/chat-context"

interface ConversationsListProps {
  selectedId?: string
}

export function ConversationsList({ selectedId }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { chats, messages, currentUser } = useChat()

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    // For demo purposes, we'll just return the timestamp as is
    // In a real app, you would parse the timestamp and format it
    return timestamp
  }

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.participants.find((p) => p.id !== currentUser?.id)
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full border-r bg-white">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const otherUser = chat.participants.find((p) => p.id !== currentUser?.id)
            const chatMessages = messages[chat.id] || []
            const lastMessage = chatMessages[chatMessages.length - 1]

            if (!otherUser) return null

            return (
              <Link
                key={chat.id}
                href={`/messages/${chat.id}`}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b",
                  selectedId === chat.id && "bg-slate-100",
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.initials}</AvatarFallback>
                  </Avatar>

                  {otherUser.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-sm">{otherUser.name}</h3>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground">{formatTimestamp(lastMessage.timestamp)}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {lastMessage ? (
                      <p
                        className={cn(
                          "text-sm truncate",
                          chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground",
                        )}
                      >
                        {lastMessage.sender === currentUser?.id ? "You: " : ""}
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    )}

                    {chat.unreadCount > 0 && (
                      <div className="ml-2 h-5 min-w-5 px-1 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        )}
      </div>
    </div>
  )
}

