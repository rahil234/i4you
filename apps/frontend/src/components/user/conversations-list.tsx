'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import useChatStore, { ChatPreview } from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { useNow } from '@/context/NowContext';

interface ConversationsListProps {
  selectedId?: string;
}

export function ConversationsList({ selectedId }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<ChatPreview[]>([]);

  const { chats, messages, isLoading, currentChat } = useChatStore();

  const { user } = useAuthStore();

  const now = useNow();

  useEffect(() => {
    if (chats) {
      setFilteredChats(chats.filter((chat) => {
        return chat?.participant.name!.toLowerCase().includes(searchQuery.toLowerCase());
      }));
      setFilteredChats(chats);
      console.log('Filtered chats:', filteredChats);
    }
  }, [chats, searchQuery, currentChat]);


  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>;
  }

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
            const chatMessages = messages[chat.id] || [];

            const lastMessage = chatMessages[chatMessages.length - 1];

            return (
              <Link
                key={chat.id}
                href={`/messages/${chat.participant.id}`}
                className={cn(
                  'flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b',
                  selectedId === chat.id && 'bg-slate-100',
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
                    <AvatarFallback>{chat.participant.initials}</AvatarFallback>
                  </Avatar>
                  {chat.participant.isOnline && (
                    <span
                      className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-sm">{chat.participant.name}</h3>
                    {chatMessages.length > 0 && (
                      <span
                        className="text-xs text-muted-foreground">{formatTimestamp(lastMessage.timestamp, now)}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {lastMessage ? (
                      <p
                        className={cn(
                          'text-sm truncate',
                          chat.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground',
                        )}
                      >
                        {lastMessage.sender === user?.id ? 'You: ' : ''}
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    )}

                    {chat.unreadCount > 0 && (
                      <div
                        className="ml-2 h-5 min-w-5 px-1 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        )}
      </div>
    </div>
  );
}
