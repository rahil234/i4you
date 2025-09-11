import { Message } from '../../entities/message.entity';

export interface IMessageRepository {
  create(
    chatId: string,
    sender: string,
    content: string,
    timestamp: number,
  ): Promise<Message>;

  findByChatId(
    chatId: string,
    page?: number,
    limit?: number,
  ): Promise<Message[]>;

  findLastMessage(chatId: string): Promise<Message | null>;

  countUnreadMessages(chatId: string, userId?: string): Promise<number>;

  markAsDelivered(chatId: string, userId?: string): Promise<void>;

  markAsRead(chatId: string, userId?: string): Promise<void>;
}
