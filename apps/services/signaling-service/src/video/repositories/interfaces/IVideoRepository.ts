import { Message } from '../../schemas/message.schema.js';

export interface IVideoRepository {
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
  markAsDelivered(chatId: string, userId?: string): Promise<any>;
  markAsRead(chatId: string, userId?: string): Promise<any>;
}
