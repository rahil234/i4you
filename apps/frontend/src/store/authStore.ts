import type { AuthState } from '@/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AuthService from '@/services/auth.service';
import UserService from '@/services/user.service';
import { StateCreator } from 'zustand/index';
import { User } from '@i4you/shared';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  googleAuthLogin: (token: string) => Promise<void>;
  facebookAuthLogin: (token: string) => Promise<void>;
  googleAuthRegister: (token: string) => Promise<void>;
  facebookAuthRegister: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  clearState: () => Promise<void>;
  refreshToken: () => Promise<string>;
  setState: (state: Partial<AuthState>) => void;
}

const authStore: StateCreator<AuthStore> = (set, getState) => ({
  user: null,
  accessToken: null,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  success: null,
  signUpError: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await AuthService.login(email, password);

    if (error) {
      set({ error: error, isLoading: false });
      return;
    }

    const { user } = data;

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  adminLogin: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await AuthService.adminLogin(email, password);
    if (error) {
      set({ error: error, isLoading: false });
      return;
    }
    set({ error: null, isLoading: false, user: data.user, isAuthenticated: true });
  },

  googleAuthLogin: async (token) => {
    set({ isLoading: true, error: null });
    const { data, error } = await AuthService.googleAuth(token, 'login');

    if (error) {
      set({ error: error, isLoading: false });
      return;
    }

    const { user } = data;

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  facebookAuthLogin: async (token) => {
    set({ isLoading: true, error: null });

    const { data, error } = await AuthService.facebookAuth(token, 'login');

    if (error) {
      set({ error: error, isLoading: false });
      return;
    }

    const { user } = data;

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  googleAuthRegister: async (token) => {
    set({ isLoading: true, error: null });
    const { data, error } = await AuthService.googleAuth(token, 'register');

    if (error) {
      set({ error: error, isLoading: false });
      return;
    }

    const { user } = data;

    set({
      user,
      success: 'Registered successfully. Please login to continue',
      isAuthenticated: true,
      isLoading: false,
    });
  },

  facebookAuthRegister: async (token) => {
    set({ isLoading: true, error: null });

    const { data, error } = await AuthService.facebookAuth(token, 'register');

    if (error) {
      set({ error: error, isLoading: false });
      return;
    }

    const { user } = data;

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (name, email, password) => {
    set({ isLoading: true, signUpError: null });
    const { data, error } = await AuthService.register(name, email, password);

    if (error) {
      set({ signUpError: error, isLoading: false });
      return;
    }

    console.log('signup data', data);

    const { user } = data;

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: async (updatedUser: any) => {
    set({ isLoading: true, error: null });
    console.log('Updating user:', updatedUser);
    const { data, error } = await UserService.updateUser(updatedUser);

    if (error) {
      set({ error: error, isLoading: false });
      return;
    }

    console.log('Updated user data:', data);

    set({ user: data, isLoading: false });
  },

  logout: async () => {
    const { error } = await AuthService.logout();
    if (error) {
      set({ error: error, isLoading: false });
      return;
    }
    await getState().clearState();
    set({ isAuthenticated: false, isLoading: false, user: null });
    console.log('Logged out');
  },

  refreshToken: async () => {
    set({ error: null });

    if (!getState().isAuthenticated) {
      return;
    }

    const { data, error } = await AuthService.refreshToken();

    if (error) {
      set({ error: error, isLoading: false });
      await getState().logout();
      return error;
    }

    const { token } = data;

    set({ isLoading: false });
    return token;
  },

  setState: ({ isLoading, isAuthenticated, user }) => {
    set({ isLoading, isAuthenticated, user });
  },

  clearState: async () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      signUpError: null,
    });
  },
});

const AuthStore = create<AuthStore>();

export const useAuthStore = AuthStore(
  devtools(
    persist(
      authStore,
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
        }),
        skipHydration: true,
      },
    ),
    { name: 'auth-store', enabled: true },
  ),
);

export default useAuthStore;
