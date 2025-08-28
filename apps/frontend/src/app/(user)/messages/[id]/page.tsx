'use client';

import React, { useEffect } from 'react';
import ChatWindow from '@/components/user/chat/chat-window';
import { useChatStore } from '@/store/chat-store';

export default function ChatPage({ params }: { params: { id: string } }) {
  const { initiateChatUser, joinChat, setCurrentChat, markAsRead } = useChatStore();

  useEffect(() => {
    if (params.id) {
      initiateChatUser(params.id);
      joinChat(params.id);
      markAsRead(params.id);
      setCurrentChat({ id: params.id, participant: { id: params.id, name: '', avatar: '' } });
    }
  }, [params.id]);

  return <ChatWindow chatId={params.id} />;
}