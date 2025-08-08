// User types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  password?: string;
  status: 'active' | 'suspended';
  bio: string;
  gender: 'male' | 'female' | 'other';
  photos: string[];
  role: 'admin' | 'member';
  interests?: string[];
  stats?: {
    matches: number;
    likes: number;
    activeDays: number;
  };
  preferences: UserPreferences;
  location: {
    type: 'Point';
    coordinates: [number, number];
    displayName: string;
  };
  onboardingCompleted: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

// User preferences
export interface UserPreferences {
  ageRange: [number, number];
  distance: number;
  showMe: 'male' | 'female' | 'all';
  lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
}

// User types for the admin panel
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'suspended';
  joined: string;
  createdAt: Date;
  updatedAt: Date;
}


// Auth types
export interface AuthState {
  user: Partial<User> | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUpError: string | null;
}


// Match types
export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
  user: User;
}

// Message types
export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
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

// Define the full onboarding data structure
export interface OnboardingData {
  // Basic info
  name: string;
  age: number;
  bio: string;

  // Photos
  photos: string[];

  // Interests
  interests: string[];

  // Preferences (reusing your existing type)
  preferences: UserPreferences;

  // Location
  location: {
    type: 'Point';
    coordinates: [number, number];
    displayName: string;
  };
}


export interface UserJwtPayload {
  sub: string;
  role: 'admin' | 'member';
  email: string;
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

