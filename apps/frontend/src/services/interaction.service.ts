import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class InteractionService {
  likeUser = (userId: string) =>
    handleApi(() =>
      api
        .post(`/interaction/${userId}/like`)
        .then(res => res.data),
    );

  superLikeUser = (userId: string) =>
    handleApi(() =>
      api
        .post(`/interaction/${userId}/super-like`)
        .then(res => res.data),
    );

  dislikeUser = (userId: string) =>
    handleApi(() =>
      api
        .post(`/interaction/${userId}/dislike`)
        .then(res => res.data),
    );


}

export default new InteractionService();
