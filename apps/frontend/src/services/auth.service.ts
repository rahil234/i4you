// src/services/AuthService.ts
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

  googleAuthLogin = (token: string) =>
    handleApi(() =>
      api
        .post('/auth/login/google', { token }, { withCredentials: true })
        .then(res => res.data),
    );

  register = (name: string, email: string, password: string) =>
    handleApi(() =>
      api
        .post('/auth/register', { name, email, password })
        .then(res => res.data),
    );

  getUser = () =>
    handleApi(() =>
      api.get('/user/me').then(res => res.data),
    );

  logout = () =>
    handleApi(() =>
      api
        .post('/auth/logout', {}, { withCredentials: true })
        .then(() => null),
    );

  refreshToken = () => {
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL;

    return handleApi(() =>
      axios
        .post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
        .then(res => res.data),
    );
  };
}