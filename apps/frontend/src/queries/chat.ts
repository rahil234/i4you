import chatService from '@/services/chat.service';
import { Message } from '@/types';

export const fetchMessages = async (chatId: string, page: number): Promise<Message[]> => {
  const { error, data } = await chatService.fetchMessages(chatId, page);
  if (error) throw new Error(error || 'Failed to fetch messages');
  return data.messages;
};