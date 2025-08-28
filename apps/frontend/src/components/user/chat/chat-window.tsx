'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatWindowProps {
  chatId: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const {
    messages,
    sendMessage,
    isTyping,
    currentChat,
    fetchMessages,
    startTyping,
    stopTyping,
  } = useChatStore();

  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load messages on mount
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId, 1);
    }
  }, [chatId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[chatId]]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input);
    setInput('');
    stopTyping(chatId);
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
        <Avatar className="rounded-full">
          <AvatarImage src={currentChat.participant.avatar} alt={currentChat.participant.name} />
          <AvatarFallback>{currentChat.participant.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{currentChat?.participant.name || 'Unknown User'}</span>
          <span className="text-xs text-muted-foreground">
            {isTyping[currentChat?.id || ''] ? 'Typing...' : currentChat?.participant.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        {(messages[chatId] || []).map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-3 py-2 rounded-2xl text-sm break-words ${
              msg.sender === user?.id
                ? 'ml-auto bg-primary text-primary-foreground rounded-br-none'
                : 'mr-auto bg-muted text-foreground rounded-bl-none'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex items-center gap-2 border-t border-border bg-card">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            startTyping(chatId);
          }}
          onBlur={() => stopTyping(chatId)}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          onClick={handleSend}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Send
        </Button>
      </div>
    </div>
  );
}