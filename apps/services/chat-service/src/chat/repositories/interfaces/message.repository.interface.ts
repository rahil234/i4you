import { Message } from '../../schemas/message.schema';

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
}
