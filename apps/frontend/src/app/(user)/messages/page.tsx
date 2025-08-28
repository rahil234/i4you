'use client';

import React, { useEffect } from 'react';
import ChatWindow from '@/components/user/chat/chat-window';
import { useChatStore } from '@/store/chat-store';
import ConversationsList from '@/components/user/chat/conversations-list';

export default function MessagesPage() {
  const { currentChat, fetchMessages } = useChatStore();

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat?.id, 1);
      console.log('Fetching messages for chat:', currentChat.id);
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-60px)] bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <div className="hidden md:flex w-1/3 xl:w-1/4 border-r border-border bg-card">
        <ConversationsList />
      </div>

      {/* Main */}
      <div className="flex-1 flex">
        {currentChat ? (
          <ChatWindow chatId={currentChat.id} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
}
