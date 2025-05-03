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
    this.preferences = user.preferences;
    this.phone = user.phone;
    this.address = user.address;
    this.joined = user.createdAt;
    this.onboarding = user.onboardingCompleted ? undefined : true;
    this.updatedAt = user.updatedAt;
  }
}

export default UserDTO;
