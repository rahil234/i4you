import type { AuthState } from '@/types';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import auth from '@/services/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  googleAuthLogin: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearState: () => Promise<void>;
  refreshToken: () => Promise<string>;
  setState: ({}: Partial<AuthState>) => void;
}

const AuthStore = create<AuthStore>();

export const useAuthStore = AuthStore(
  devtools(
    persist(
      function authStore(set, getState) {
        return {
          user: null,
          accessToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          signUpError: null,

          login: async (email, password) => {
            set({ isLoading: true, error: null });
            const { data, error } = await auth.login(email, password);

            if (error) {
              set({ error: error, isLoading: false });
              return;
            }

            const { user, token: accessToken } = data;

            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          },

          googleAuthLogin: async (token: string) => {
            set({ isLoading: true, error: null });
            const { data, error } = await auth.googleAuthLogin(token);

            if (error) {
              set({ error: error, isLoading: false });
              return;
            }

            const { user, token: accessToken } = data;

            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          },

          register: async (name: string, email: string, password: string) => {
            set({ isLoading: true, signUpError: null });
            const { data, error } = await auth.register(name, email, password);

            if (error) {
              set({ signUpError: error, isLoading: false });
              return;
            }

            console.log('signup data', data);

            const { user, token: accessToken } = data;

            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          },

          logout: async () => {
            const { error } = await auth.logout();
            if (error) {
              set({ error: error, isLoading: false });
              return;
            }
            await getState().clearState();
            console.log('Logged out');
          },

          refreshToken: async () => {
            set({ error: null });

            if (!getState().isAuthenticated) {
              return;
            }

            const { data, error } = await auth.refreshToken();

            if (error) {
              set({ error: error, isLoading: false });
              await getState().logout();
              return error;
            }

            const { token } = data;

            set({ accessToken: token, isLoading: false });
            return token;
          },

          setState: ({ isLoading, isAuthenticated, user, accessToken }) => {
            set({ isLoading, isAuthenticated, user, accessToken });
          },

          clearState: async () => {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              signUpError: null,
            });
          },
        };
      },
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),{name:'auth-store', enabled: true}
  ),
);

export default useAuthStore;
