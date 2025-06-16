'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Check, CheckCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useChatStore from '@/store/chatStore';
import { useDebounce } from '@/hooks/use-debounce';

interface ChatProps {
  chatId: string;
}

export function Chat({ chatId }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const debouncedIsComposing = useDebounce(isComposing, 500);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, joinChat, sendMessage, markAsRead, isTyping, startTyping, stopTyping } = useChatStore();

  const chatMessages = messages[chatId] || [];

  // Mark messages as read when the chat is opened
  useEffect(() => {
    joinChat(chatId);
  }, [chatId]);

  useEffect(() => {
    markAsRead(chatId);
  }, [chatId, markAsRead]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle typing indicators
  useEffect(() => {
    if (debouncedIsComposing) {
      startTyping(chatId);
    } else {
      stopTyping(chatId);
    }
  }, [debouncedIsComposing, chatId, startTyping, stopTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    sendMessage('1', newMessage);
    setNewMessage('');
    setIsComposing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsComposing(e.target.value.length > 0);
  };

  const { chats, currentUser } = useChatStore();
  const chat = chats ? chats.find((c) => c.id === chatId) : null;
  const otherUser = chat?.participants.find((p) => p.id !== currentUser?.id);

  if (!chat || !otherUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }

  // Render status icon based on message status
  const renderStatusIcon = (status?: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center gap-3 bg-white">
        <Link href="/messages" className="md:hidden mr-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>

        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
          <AvatarFallback>{otherUser.initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-medium text-sm">{otherUser.name}</h3>
          <p className="text-xs text-muted-foreground">
            {otherUser.isOnline ? (
              <span className="text-green-500">Online now</span>
            ) : (
              `Last active ${otherUser.lastActive}`
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={cn('flex', message.sender === currentUser?.id ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-lg px-4 py-2 text-sm',
                message.sender === currentUser?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200',
              )}
            >
              <p className="mb-1">{message.content}</p>
              <div className="flex justify-end items-center gap-1 text-xs opacity-70">
                <span>{message.timestamp}</span>
                {message.sender === currentUser?.id && renderStatusIcon(message.status)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping[chatId] && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2 text-sm">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                  •
                </span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                  •
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={handleInputChange}
          />
          <Button type="submit" size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
