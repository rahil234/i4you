'use client';

import React, { useEffect } from 'react';
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
      <div className="w-full border-r flex flex-col">
        <ConversationsList />
      </div>
    </div>
  );
}
