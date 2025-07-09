import { User as BaseUser } from '@i4you/shared';

// User types
export interface User extends Omit<BaseUser, 'location'> {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  distance?: string;
  interests?: string[];
  avatar?: string;
}

// Auth types
export interface AuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  signUpError: string | null;
}


export type SetUserType = {
  token: string;
  user: Partial<User>;
}

// User preferences
export interface UserPreferences {
  ageRange: [number, number];
  distance: number;
  showMe: 'male' | 'female' | 'all';
  lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
}

// Match types
export interface Match {
  id: string;
  matchedUserId: string;
  createdAt: string;
  user: Omit<
    Partial<User>,
    | 'password'
    | 'email'
    | 'onboardingCompleted'
    | 'gender'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  >;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type UserData = {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token: string | null;
};

// Define the full onboarding data structure
export interface OnboardingData {
  // Basic info
  name: string;
  age: number | null;
  bio: string;
  gender: string | null;

  // Photos
  photos: string[];

  // Interests
  interests: string[];

  // Preferences (reusing your existing type)
  preferences: UserPreferences;

  // Location
  location: Omit<BaseUser['location'], 'type'>;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export type ChatUser = Partial<User> & {
  id: string
  initials?: string;
  avatar: string;
  lastActive?: string;
  isOnline?: boolean;
  lastMessage?: Message;
}

export interface Chat {
  id: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface ChatContextType {
  chats: Chat[];
  messages: Record<string, Message[]>;
  currentUser: ChatUser | null;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'connecting';
  joinChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  markAsRead: (chatId: string) => void;
  isTyping: Record<string, boolean>;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
}