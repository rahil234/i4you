import { User } from '@i4you/shared';
import { Chat } from '../schemas/chat.schema';
import { ChatPreview, Message } from '../../types';

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
  lastMessage: Message | null;
  unreadCount: number;

  constructor(
    chat: Chat,
    user: User,
    lastMessage: Message | null,
    unreadCount = 0,
  ) {
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
    this.lastMessage = lastMessage ? lastMessage : null;
    this.unreadCount = unreadCount;
  }
}
