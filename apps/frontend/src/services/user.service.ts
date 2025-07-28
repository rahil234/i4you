import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';
import { FilterType } from '@/components/users-table';

class UserService {
  getUser = () =>
    handleApi(() =>
      api
        .get('/user/me')
        .then(res => res.data),
    );

  getPotentialMatches = () => handleApi(() =>
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

  getUsers = ({ page, limit, filters }: { page: number; limit: number, filters: FilterType }) =>
    handleApi(() =>
      api
        .get(`/user?${page ? `page=${page}` : ''}${limit ? `&limit=${limit}` : ''}&search=${filters.search || ''}&status=${filters.status || ''}&gender=${filters.gender || ''}`)
        .then(res => res.data),
    );

  updateUser = (data: any) =>
    handleApi(() =>
      api
        .patch('/user/me', { data })
        .then(res => res.data));

  likeUser = (userId: string) =>
    handleApi(() =>
      api
        .post(`/user/${userId}/like`)
        .then(res => res.data),
    );

  changePassword = (data: { currentPassword: string; newPassword: string }) =>
    handleApi(() =>
      api
        .patch('/auth/change-password', { data })
        .then(res => res.data),
    );
}

export default new UserService();
