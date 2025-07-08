'use client';

import { useEffect } from 'react';
import { getNotificationSocket } from '@/lib/notification-websocket';
import useMatchesStore from '@/store/matchesStore';

export default function NotificationListener({ userId }: { userId: string }) {
  const { pushNewMatch } = useMatchesStore();

  useEffect(() => {
    const socket = getNotificationSocket();
    socket.connect();

    const offMatch = socket.on('match', (data) => {
      console.log('💘 Match notification:', data);
      pushNewMatch(data);
    });

    const offChat = socket.on('chat', (data) => {
      console.log('💬 New chat:', data);
    });

    const offStatus = socket.onStatusChange((status) => {
      console.log('🔌 Status changed:', status);
    });

    return () => {
      offMatch();
      offChat();
      offStatus();
      socket.disconnect();
    };
  }, [userId]);

  return <></>;
}