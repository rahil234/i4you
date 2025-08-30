'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat-store';
import { useAuthStore } from '@/store/auth-store';
import { formatTimestamp } from '@/utils/formatTimestamp';

interface ConversationsListProps {
  selectedId?: string;
}

export default function ConversationsList({ selectedId }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuthStore();
  const { chats, messages, isLoading, isTyping } = useChatStore();

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter((chat) =>
      chat?.participant.name!.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, chats]);

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Search */}
      <div className="px-4 py-3 bg-background sticky top-0 border-b flex flex-col gap-2">
        <h2 className="text-xl font-bold text-foreground">Messages</h2>
        <input
          aria-label="Search conversations"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-full bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Chats List */}
      <div className="overflow-y-auto" role="list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const chatMessages = messages[chat.id] || [];
            const lastMessage = chat.lastMessage || (chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null);
            const isActive = selectedId === chat.participant.id;

            return (
              <Link
                key={chat.id}
                href={`/messages/${chat.participant.id}`}
                role="listitem"
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition rounded-xl',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'hover:bg-secondary',
                )}
              >
                {/* Avatar */}
                <Avatar className="rounded-full">
                  <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
                  <AvatarFallback>{chat.participant.initials}</AvatarFallback>
                </Avatar>

                {/* Chat Info */}
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span
                      className={cn(
                        'truncate',
                        chat.unreadCount > 0 && !isActive
                          ? 'font-bold text-foreground'
                          : 'font-medium',
                      )}
                    >
                      {chat.participant.name}
                    </span>
                    {lastMessage && (
                      <span
                        className={cn(
                          'text-xs',
                          isActive ? 'text-primary-foreground/80' : 'text-muted-foreground',
                        )}
                      >
                        {formatTimestamp(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>

                  <span
                    className={cn(
                      'text-xs truncate',
                      isActive ? 'text-primary-foreground/90' : 'text-muted-foreground',
                    )}
                  >
                    {isTyping[chat.participant.id]
                      ? 'Typing...' : lastMessage
                        ? `${lastMessage.sender === user?.id ? 'You: ' : ''}${lastMessage.content}`
                        : 'No messages yet'}
                  </span>
                </div>

                {chat.unreadCount > 0 && (
                  <span
                    className={cn(
                      'ml-2 text-xs px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-primary text-primary-foreground',
                    )}
                  >
                    {chat.unreadCount}
                  </span>
                )}
              </Link>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center mt-6">No conversations found</p>
        )}
      </div>
    </div>
  );
}
