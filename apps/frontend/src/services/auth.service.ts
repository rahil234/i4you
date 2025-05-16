import api from '@/lib/api';
import axios from 'axios';
import { handleApi } from '@/utils/apiHandler';

export class AuthService {
  login = (email: string, password: string) =>
    handleApi(() =>
      api
        .post('/auth/login', { email, password }, { withCredentials: true })
        .then(res => res.data),
    );

  adminLogin = (email: string, password: string) =>
    handleApi(() =>
      api
        .post('/auth/login/admin', { email, password }, { withCredentials: true })
        .then(res => res.data),
    );

  googleAuth = (token: string, type: 'register' | 'login') =>
    handleApi(() =>
      api
        .post(`/auth/${type}/google`, { token }, { withCredentials: true })
        .then(res => res.data),
    );

  facebookAuth = (token: string, type: 'register' | 'login') =>
    handleApi(() =>
      api
        .post(`/auth/${type}/facebook`, { token }, { withCredentials: true })
        .then(res => res.data),
    );

  register = (name: string, email: string, password: string) =>
    handleApi(() =>
      api
        .post('/auth/register', { name, email, password })
        .then(res => res.data),
    );

  logout = () =>
    handleApi(() =>
      api
        .post('/auth/logout', {}, { withCredentials: true })
        .then(() => null),
    );

  forgetPassword = (email: string) =>
    handleApi(() =>
      api.post('/auth/forgot-password', { email }).then(res => res.data),
    );

  resetPassword = (password: string, token: string) =>
    handleApi(() =>
      api.post('/auth/reset-password', { password, token }).then(res => res.data),
    );

  verifyAccount = (password: string, token: string) =>
    handleApi(() =>
      api
        .post('/auth/verify-account', { password, token })
        .then(res => res.data),
    );

  refreshToken = () => {
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL;

    return handleApi(() =>
      axios
        .post(`${baseURL}/api/v1/auth/refresh-token`, {}, { withCredentials: true })
        .then(res => res.data),
    );
  };
}

export default new AuthService();
