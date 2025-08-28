'use client';

import React, { useState, useMemo } from 'react';
import { useChatStore } from '@/store/chat-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import clsx from 'clsx';

export default function ConversationsList() {
  const { chats, currentChat, setCurrentChat, messages } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter chats by participant name
  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) return chats;
    return chats.filter((chat) =>
      chat.participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, chats]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Search */}
      <div className="px-4 py-3 bg-background sticky top-0 border-b flex flex-col gap-2">
        <h2 className="text-xl font-bold">Messages</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>

      {/* Chats */}
      <div className="overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">No conversations found</p>
        ) : (
          filteredChats.map((chat) => {
            const isActive = currentChat?.id === chat.id;
            return (
              <button
                key={chat.id}
                onClick={() =>
                  setCurrentChat({ id: chat.id, participant: chat.participant })
                }
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition rounded-xl',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow'
                    : 'hover:bg-rose-50',
                )}
              >
                <Avatar className="rounded-full">
                  <AvatarImage
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                  />
                  <AvatarFallback>{chat.participant.initials}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="font-medium truncate">
                    {chat.participant.name}
                  </span>
                  <span
                    className={clsx(
                      'text-xs truncate',
                      isActive ? 'text-pink-100' : 'text-gray-500',
                    )}
                  >
                    {messages[chat.id][0]?.content || ''}
                  </span>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="ml-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}