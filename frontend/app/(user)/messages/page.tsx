"use client"

import { ConversationsList } from "@/components/conversations-list"
import { UserLayout } from "@/components/user-layout"
import { ChatProvider } from "@/contexts/chat-context"

export default function MessagesPage() {
  return (
    <ChatProvider>
      <UserLayout>
        <div className="md:container mx-auto max-w-6xl md:p-4 md:pt-6 h-[calc(100vh-64px)]">
          <div className="md:border md:rounded-lg md:shadow-sm h-full overflow-hidden bg-white">
            <div className="md:grid md:grid-cols-[350px_1fr] h-full">
              <ConversationsList />

              <div className="hidden md:flex items-center justify-center h-full bg-gray-50 text-center p-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </ChatProvider>
  )
}

