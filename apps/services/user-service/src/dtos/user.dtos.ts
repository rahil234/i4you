import { User, UserPreferences } from '@repo/shared';

class UserDTO implements User {
  id: string;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'suspended';
  bio: string;
  photos: string[];
  role: 'admin' | 'member';
  onboarding?: boolean;
  interests?: string[];
  stats?: {
    matches: number;
    likes: number;
    activeDays: number;
  };
  preferences: UserPreferences;
  location: string;
  phone: string;
  address: string;
  joined: string;
  updatedAt: string;

  constructor(user: any, role?: 'admin' | 'member') {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = role || user.role;
    this.status = user.status;
    this.age = user.age;
    this.bio = user.bio;
    this.photos = user.photos;
    this.location = user.location;
    this.interests = user.interests;
    this.preferences = user.preferences;
    this.phone = user.phone;
    this.address = user.address;
    this.joined = user.createdAt;
    this.onboarding = user.onboardingCompleted ? undefined : true;
    this.updatedAt = user.updatedAt;

    this.stats = {
      matches: user.matches ? user.matches.length : 0,
      likes: user.likes ? user.likes.length : 0,
      activeDays: user.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
    };
  }
}

export default UserDTO;
