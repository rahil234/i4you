'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chat-store';
import ChatWindow from '@/components/user/chat/chat-window';
import ConversationsList from '@/components/user/chat/conversations-list';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { initiateChatUser, joinChat, setCurrentChat, markAsRead, chats, currentChat, isLoading } = useChatStore();
  const [isNewChat, setIsNewChat] = useState(true);

  const [chat, setChat] = useState(currentChat);

  const resolvedParams = React.use(params);

  const userId = resolvedParams.id;

  const chatUser = chats.find(chat => chat.participant.id === userId);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !chatUser && userId && !currentChat) {
      initiateChatUser(userId);
    }
  }, [userId, initiateChatUser, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setChat(currentChat);
    }
  }, [currentChat, isLoading]);

  useEffect(() => {
    const matchedChat = chats.find((c) => c.participant.id === userId) || null;
    if (matchedChat) {
      setIsNewChat(false);
      setChat(matchedChat);
    }
  }, [chats, userId]);
  
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] bg-background text-foreground">
        <div className="md:grid md:grid-cols-[350px_1fr] h-full">

          {/* Sidebar skeleton */}
          <div className="hidden md:flex flex-col border-r border-border">
            {/* Header */}
            <div className="px-4 py-3 bg-background border-b flex flex-col gap-2">
              <div className="h-6 w-28 bg-muted rounded animate-pulse" />
              <div className="h-9 w-full bg-muted rounded-full animate-pulse" />
            </div>

            {/* Chats list skeleton */}
            <div className="overflow-y-auto">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
                >
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />

                  {/* Chat info */}
                  <div className="flex flex-col flex-1 overflow-hidden gap-2">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-2 w-10 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-36 bg-muted rounded animate-pulse" />
                  </div>

                  {/* Unread badge */}
                  {i % 2 === 0 && (
                    <div className="h-5 w-8 rounded-full bg-muted animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat window skeleton */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-3 border-b flex items-center gap-3 bg-card">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                <div className="h-2 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="h-10 w-40 bg-muted rounded-xl animate-pulse" />
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-card flex gap-2">
              <div className="flex-1 h-10 rounded-full bg-muted animate-pulse" />
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] bg-background text-foreground transition-colors">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex w-80 border-r flex-col">
        <ConversationsList selectedId={userId} />
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with back button */}
        <div className="md:hidden p-2 border-b border-border bg-card flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/messages')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium">Chat</span>
        </div>
        {chat ? (
          <ChatWindow chat={chat} isNewChat={isNewChat} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
}
