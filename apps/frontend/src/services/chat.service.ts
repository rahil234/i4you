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

  fetchMessages = (chatId: string, limit: number = 10) =>
    handleApi(() =>
      api
        .get(`chat/${chatId}/messages?limit=${limit}`)
        .then(res => res.data),
    );
}

export default new ChatService();
