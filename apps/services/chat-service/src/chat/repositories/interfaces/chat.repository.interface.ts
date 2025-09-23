import { Chat } from '../../schemas/chat.schema';

export interface IChatRepository {
  create(participants: string[]): Promise<Chat>;

  findById(chatId: string): Promise<Chat | null>;

  findByUser(userId: string): Promise<Chat[]>;

  findByParticipants(userA: string, userB: string): Promise<Chat | null>;

  updateLastMessage(
    chatId: string,
    message: { sender: string; content: string; timestamp: string },
  ): Promise<void>;
}
