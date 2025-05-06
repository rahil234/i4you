import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const baseURL = API_URL + '/api/v1/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  },
);

// Flag to prevent multiple refresh-token requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await useAuthStore.getState().refreshToken();
          isRefreshing = false;

          if (newToken) {
            onTokenRefreshed(newToken);
            return api(originalRequest); // Retry failed request
          }
        } else {
          return new Promise((resolve) => {
            addRefreshSubscriber((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest)); // Retry with a new token
            });
          });
        }
      } catch (refreshError) {
        await useAuthStore.getState().logout(); // Logout on refresh-token failure
      }
    }

    return Promise.reject(error);
  },
);

export default api;
