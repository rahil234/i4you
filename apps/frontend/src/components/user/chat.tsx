'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Video, Phone, Check, CheckCheck, Clock, AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useChatStore, ChatUser } from '@/store/chat-store';
import { useAuthStore } from '@/store/auth-store';
import { useDebounce } from '@/hooks/use-debounce';
import { formatTimestamp } from '@/utils/formatTimestamp';
import useVideoCallStore from '@/store/video-store';
import { Message } from '@/types';

interface ChatProps {
  chat: ChatUser;
  userId: string;
  isNewChat?: boolean;
}

export function Chat({ chat, userId, isNewChat }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const {
    messages,
    joinChat,
    sendMessage,
    sendNewChatMessage,
    isTyping,
    startTyping,
    stopTyping,
    fetchMessages,
    isMessagesLoading,
  } = useChatStore();

  const { placeCall } = useVideoCallStore();
  const debouncedIsComposing = useDebounce(isComposing, 500);

  useEffect(() => {
    if (chat?.id) joinChat(chat.id);
    fetchMessages(chat?.id, 0);
  }, [chat?.id]);

  useEffect(() => {
    if (chat) setChatMessages([...messages[chat.id] || []].reverse());
  }, [messages, chat]);

  useEffect(() => {
    if (debouncedIsComposing) startTyping(chat?.id);
    else stopTyping(chat?.id);
  }, [debouncedIsComposing]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    isNewChat ? sendNewChatMessage(userId, newMessage) : sendMessage(chat.id, newMessage);
    setNewMessage('');
    setIsComposing(false);
  };

  const renderStatusIcon = (status?: 'pending' | 'sent' | 'delivered' | 'read' | 'error') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-white" />;
      case 'sent':
        return <Check className="h-3 w-3 text-white" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-white" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-cyan-400" />;
      default:
        return <AlertCircleIcon className="h-3 w-3 text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-gradient-to-r from-pink-500 to-red-500 text-white">
        <Link href="/messages" className="md:hidden">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>

        <Avatar className="h-10 w-10 ring-2 ring-white/40">
          <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
          <AvatarFallback>{chat.participant.initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-semibold">{chat.participant.name}</h3>
          <p className="text-xs">
            {chat.participant.isOnline ? 'Online now' : `Last active ${formatTimestamp(chat.participant.lastActive!)}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" className="bg-white/20 hover:bg-white/30 rounded-full"
                  onClick={() => placeCall(chat.participant)}>
            <Video className="h-5 w-5 text-white" />
          </Button>
          <Button size="icon" className="bg-white/20 hover:bg-white/30 rounded-full">
            <Phone className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isMessagesLoading && <p className="text-center text-gray-400">Loading...</p>}

        {chatMessages.map((message, i) => (
          <div key={i} className={cn('flex', message.sender === user?.id ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[70%] rounded-2xl px-4 py-2 text-sm relative shadow',
              message.sender === user?.id
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                : 'bg-white text-gray-800 border',
            )}>
              <p>{message.content}</p>
              <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] opacity-70">
                <span>{formatTimestamp(message.timestamp)}</span>
                {message.sender === user?.id && renderStatusIcon(message.status)}
              </div>
            </div>
          </div>
        ))}

        {isTyping[userId] && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-full px-3 py-1 text-sm flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsComposing(!!e.target.value);
            }}
          />
          <Button type="submit" size="icon"
                  className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
            <Send className="h-5 w-5 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}
