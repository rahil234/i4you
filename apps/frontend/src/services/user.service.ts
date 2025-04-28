import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class UserService {
  getUser = () =>
    handleApi(() =>
      api
        .get('/user/me')
        .then(res => res.data),
    );

  updateUserStatus = (userId: string, status: string) =>
    handleApi(() =>
      api
        .patch(`/user/${userId}/status`, { status })
        .then(res => res.data),
    );

  getUsers = () =>
    handleApi(() =>
      api
        .get('/user')
        .then(res => res.data),
    );
}

export default new UserService();
