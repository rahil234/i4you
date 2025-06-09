import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class ChatService {
  fetchChats = (limit: number = 50) =>
    handleApi(() =>
      api
        .get(`/chat?limit=${limit}`)
        .then(res => res.data),
    );
}

export default new ChatService();
