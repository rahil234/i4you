'use client';

import { create } from 'zustand';
import { getSocketClient } from '@/lib/websocket';
import ChatService from '@/services/chat.service';
import { Message } from '@/types';
import { StateCreator } from 'zustand/index';
import { devtools } from 'zustand/middleware';
import chatService from '@/services/chat.service';
import AuthStore from '@/store/authStore';

export type ChatUser = {
  id: string;
  participant: {
    id: string;
    name: string;
    initials?: string;
    avatar: string;
    lastActive?: string;
    isOnline?: boolean;
    lastMessage?: Message;
  };
}

export interface ChatPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  messages?: Message[];
  unreadCount: number;
}

interface ChatStore {
  chats: ChatPreview[];
  messages: Record<string, Message[]>;
  currentChat: ChatUser | null;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'connecting';
  isTyping: Record<string, boolean>;
  isLoadingChats: boolean;
  chatsError: string | null;
  setChats: (chats: ChatPreview[]) => void;
  setCurrentChat: (user: ChatUser) => void;
  initiateChatUser: (userId: string) => void;
  joinChat: (chatId: string) => boolean;
  leaveChat: (chatId: string) => boolean;
  sendMessage: (chatId: string, content: string, newChat: boolean) => void;
  markAsRead: (chatId: string) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
}

const chatStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (set) => {
  let wsClient;

  wsClient = getSocketClient();

  if (typeof window !== 'undefined') {
    wsClient.connect();
  }

  wsClient.on('message', (message: any) => {

    console.log('Received message:', message);

    const newMessage: Message = {
      id: message.id,
      chatId: message.chatId,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      status: 'delivered',
    };

    set((state) => {
      const chatMessages = [...(state.messages[message.chatId] || []), newMessage];
      const updatedMessages = { ...state.messages, [message.chatId]: chatMessages };

      const updatedChats = state.chats?.map((chat) =>
        chat.id === message.chatId
          ? { ...chat, lastMessage: newMessage, unreadCount: chat.unreadCount + 1 }
          : chat,
      ) || null;

      return { messages: updatedMessages, chats: updatedChats };
    });
  });

  wsClient.on('typing', (payload: { sender: string; isTyping: boolean }) => {
    set((state) => ({
      isTyping: { ...state.isTyping, [payload.sender]: payload.isTyping },
    }));
  });

  wsClient.on('newChat', (payload: ChatPreview) => {
    set((state) => ({
      chats: [payload, ...state.chats],
    }));
  });

  wsClient.on('chatUpdated', (payload: ChatPreview) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === payload.id ? { ...chat, ...payload } : chat,
      ),
    }));
  });

  wsClient.on('chatDeleted', (payload: { chatId: string }) => {
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== payload.chatId),
    }));
  });

  wsClient.onStatusChange((status) => {
    set({ connectionStatus: status });
    if (status === 'connected') {
      console.log('WebSocket connected from chat store');
    }
  });

  (async () => {
    const { data, error } = await ChatService.fetchChats();
    if (error) {
      set({ isLoadingChats: false, chatsError: error });
    } else {
      const messagesMap: Record<string, Message[]> = {};

      const chats = data.map((chat: ChatPreview) => {
        messagesMap[chat.id] = chat.messages || [];
        return chat;
      });

      set({
        chats,
        messages: messagesMap,
        isLoadingChats: false,
      });
    }
  })();

  return {
    chats: [],
    messages: {},
    currentChat: null,
    connectionStatus: 'connecting' as 'connecting' | 'connected' | 'disconnected' | 'error',
    isTyping: {},
    isLoadingChats: true,
    chatsError: null,

    setChats: (chats) => set({ chats }),

    setCurrentChat: (user) => set({ currentChat: user }),

    initiateChatUser: async (chatId) => {
      const { error, data } = await chatService.getInitialChatUser(chatId);

      if (error) {
        console.error('Error fetching chat user:', error);
        return null;
      }

      set({
        currentChat: data as ChatUser,
      }, undefined, 'chatStore/fetchChatUser/updateState');
    },

    joinChat: (chatId) => {
      if (wsClient.isConnected()) {
        return wsClient.joinRoom(chatId);
      }
      return false;
    },

    leaveChat: (chatId: string) => {
      if (wsClient.isConnected()) {
        return wsClient.leaveRoom(chatId);
      }
      return false;
    },

    sendMessage: (chatId, content, newChat = false) => {

      console.log('Sending message:', { chatId, content, newChat });

      if (!content.trim() || !AuthStore.getState().user) return;

      console.log('check passed for sending message:', { chatId, content, newChat });

      const newMessage: Message = {
        id: `m${Date.now()}`,
        chatId,
        content,
        sender: AuthStore.getState().user?.id!,
        timestamp: new Date(),
        status: 'sent',
        newChat,
      };

      set((state) => {
        const chatMessages = [...(state.messages[chatId] || []), newMessage];
        const updatedMessages = { ...state.messages, [chatId]: chatMessages };
        const updatedChats = state.chats?.map((chat) =>
          chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat,
        ) || null;
        return { messages: updatedMessages, chats: updatedChats };
      }, undefined, 'chatStore/sendMessage/updateState');

      const status = wsClient.send('message', {
        chatId,
        content,
        newChat,
      });

      if (status) {
        console.log('Message sent successfully:', newMessage);
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg,
            ),
          },
        }));
      } else {
        console.error('Failed to send message:', newMessage);
        return;
      }
    },

    markAsRead: (chatId) => {
      set((state) => ({
        chats: state.chats?.map((chat) =>
          chat.participant.id === chatId ? { ...chat, unreadCount: 0 } : chat,
        ) || null,
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId]?.map((msg) =>
            msg.sender !== state.currentChat?.participant.id ? { ...msg, status: 'read' } : msg,
          ) || [],
        },
      }));

      wsClient.send('read_receipt', { chatId });
    },

    startTyping: (chatId) => {
      wsClient.send('typing', { chatId, isTyping: true });
    },

    stopTyping: (chatId) => {
      wsClient.send('typing', { chatId, isTyping: false });
    },
  };
};

export const useChatStore = create<ChatStore>()(
  devtools(
    chatStore,
    { name: 'chat-store', enabled: true },
  ),
);

export default useChatStore;
