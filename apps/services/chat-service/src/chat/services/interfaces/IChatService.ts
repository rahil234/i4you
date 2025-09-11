import { Chat } from '../../schemas/chat.schema';
import { Message } from '../../entities/message.entity';

export interface IChatService {
  findChatById(chatId: string): Promise<Chat | null>;

  findChatsByUserId(userId: string): Promise<any>;

  getInitialChatUser(userId: string): Promise<any>;

  findChatByParticipants(userA: string, userB: string): Promise<Chat | null>;

  createChat(userA: string, userB: string): Promise<Chat>;

  createMessage(message: Omit<Message, 'id' | 'status'>): Promise<Message>;

  getMessages(
    chatId: string,
    page?: number,
    limit?: number,
  ): Promise<Message[]>;

  markMessagesAsDelivered(chatId: string, userId?: string): Promise<any>;

  markMessagesAsRead(chatId: string, userId?: string): Promise<any>;
}
