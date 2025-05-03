// User types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  distance?: string;
  interests?: string[];
  avatar?: string;
  onboarding?: boolean;
  status: 'active' | 'suspended';
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

// User preferences
export interface UserPreferences {
  ageRange: [number, number];
  distance: number;
  gender: 'male' | 'female' | 'all';
  showMe: 'male' | 'female' | 'all';
  lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
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
  location: string;
}


export interface UserJwtPayload {
  sub: string;
  role: 'admin' | 'member';
  email: string;
}