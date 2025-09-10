'use client';

import { useEffect } from 'react';
import { getNotificationSocket } from '@/lib/notification-websocket';
import { useMatchesStore } from '@/store/matches-store';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';

export default function NotificationListener() {
  const { pushNewMatch } = useMatchesStore();
  const { newChat, newMessage } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const socket = getNotificationSocket();

    if (!user) {
      console.warn('No user found, skipping notification listener setup');
      socket.disconnect();
      return;
    }

    socket.connect();

    const offMatch = socket.on('match', (data) => {
      console.log('💘 Match notification:', data);
      pushNewMatch(data);
    });

    const offChat = socket.on('chat', (data) => {
      console.log('💬 New chat:', data);
      const { chat, message } = data;
      newChat(chat, message);
    });

    const offMessage = socket.on('message', (data) => {
      console.log('📩 New message:', data);
      newMessage(data);
    });

    const offStatus = socket.onStatusChange((status) => {
      console.log('🔌 Status changed:', status);
    });

    return () => {
      offMatch();
      offMessage();
      offChat();
      offStatus();
      if (!user) {
        socket.disconnect();
      }
      console.log('Notification listener cleaned up', user ? `for user ${user.id}` : 'without user context');
    };
  }, [user]);

  return <></>;
}