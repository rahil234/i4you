import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class UserService {
  getUser = () =>
    handleApi(() =>
      api
        .get('/user/me')
        .then(res => res.data),
    );

  getMyMatches = () => handleApi(() =>
    api
      .get('/user/matches')
      .then(res => res.data),
  );

  updateUserStatus = (userId: string, status: string) =>
    handleApi(() =>
      api
        .patch(`/user/${userId}/status`, { status })
        .then(res => res.data),
    );

  getUsers = ({ page, limit }: { page: number; limit: number }) =>
    handleApi(() =>
      api
        .get('/user')
        .then(res => res.data),
    );

  updateUser = (data: any) =>
    handleApi(() =>
      api
        .patch('/user/me', { data })
        .then(res => res.data));

  changePassword = (data: { currentPassword: string; newPassword: string }) =>
    handleApi(() =>
      api
        .patch('/auth/change-password', { data })
        .then(res => res.data),
    );
}

export default new UserService();
