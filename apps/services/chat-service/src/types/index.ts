export interface Message {
  chatId: string;
  sender: string;
  content: string;
  timestamp: number;
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
  lastMessage: Message | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  status?: 'sent' | 'delivered' | 'read';
}
