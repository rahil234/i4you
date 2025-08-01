import { Message, User } from '@i4you/shared';
import { Chat } from '../schemas/chat.schema';

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
  messages: Message[];
  unreadCount: number;
}

export class ChatResponseDto implements ChatPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  messages: Message[];
  unreadCount: number;

  constructor(chat: Chat, user: User, messages: Message[] = []) {
    this.id = String(chat.id);
    this.participant = {
      id: user.id,
      name: user.name,
      avatar: user.photos[0],
      initials: user.name
        .split(' ')
        .map((n) => n.charAt(0).toUpperCase())
        .join(''),
      isOnline: true,
      lastActive: 'Not Implemented',
    };
    this.messages = messages;
    this.unreadCount = 2;
  }
}
