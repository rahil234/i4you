import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class ChatService {
  fetchChats = (limit: number = 50) =>
    handleApi(() =>
      api
        .get(`/chat?limit=${limit}`)
        .then(res => res.data),
    );

  getInitialChatUser = (userId: string) =>
    handleApi(() =>
      api
        .get(`/chat/user/${userId}`)
        .then(res => res.data),
    );

  createChat = (userId: string) =>
    handleApi(() =>
      api
        .post(`chat/${userId}/create`)
        .then(res => res.data),
    );

  fetchMessages = (chatId: string, page: number = 0, limit: number = 15) =>
    handleApi(() =>
      api
        .get(`chat/${chatId}/messages?page=${page}&limit=${limit}`)
        .then(res => res.data),
    );
}

export default new ChatService();
