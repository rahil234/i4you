import type { AuthState } from '@/types';
import { create } from 'zustand/index';
import { devtools, persist } from 'zustand/middleware';
import auth from '@/services/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  googleAuthLogin: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setHasHydrated: (isHydrated: boolean) => void;
  clearState: () => Promise<void>;
  refreshToken: () => Promise<string>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(devtools(
  persist(
    (set, getState) => ({
      user: null,
      accessToken: null,
      isAuthenticated: true,
      isLoading: true,
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

      setHasHydrated: async () => {

        const { isAuthenticated, accessToken, refreshToken, fetchUser, logout } = getState();

        if (isAuthenticated) {
          await refreshToken();
          if (accessToken) {
            console.log("User is valid Fetching user");
            await fetchUser();
          } else {
            console.log("User is not valid Logging out");
            await logout();
          }
        }

        set({ isLoading: false });
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
        console.log('Cleared auth state');
        console.log(getState().isAuthenticated);
      },

      fetchUser: async () => {
        if (!getState().isAuthenticated || !getState().accessToken) {
          return;
        }
        const { data, error } = await auth.getUser();
        if (error) {
          set({ error: error, isLoading: false });
          return;
        }
        set({ user: data.user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: (state) => () => {
        state.setHasHydrated(true);
      },
    },
  ),
));

export default useAuthStore;
