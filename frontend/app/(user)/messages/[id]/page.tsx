"use client"

import { useParams } from "next/navigation"
import { ConversationsList } from "@/components/conversations-list"
import { Chat } from "@/components/chat"
import { UserLayout } from "@/components/user-layout"
import { ChatProvider } from "@/contexts/chat-context"

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string

  return (
    <ChatProvider>
      <UserLayout>
        <div className="md:container mx-auto max-w-6xl md:p-4 md:pt-6 h-[calc(100vh-64px)]">
          <div className="md:border md:rounded-lg md:shadow-sm h-full overflow-hidden bg-white">
            <div className="md:grid md:grid-cols-[350px_1fr] h-full">
              <div className="hidden md:block">
                <ConversationsList selectedId={chatId} />
              </div>

              <Chat chatId={chatId} />
            </div>
          </div>
        </div>
      </UserLayout>
    </ChatProvider>
  )
}

