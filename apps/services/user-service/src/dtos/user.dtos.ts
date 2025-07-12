import { User, UserPreferences } from '@i4you/shared';

class UserDTO implements Omit<User, 'location'> {
  id: string;
  name: string;
  email: string;
  age: number;
  avatar?: string;
  gender: 'male' | 'female' | 'other';
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
  location: string;
  preferences: UserPreferences;
  distance?: string;
  phone: string;
  address: string;
  joined: string;
  status: 'active' | 'suspended';

  constructor(user: any) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.photos = user.photos;
    this.avatar = user.avatar || user.photos[0] || '';
    this.status = user.status;
    this.age = user.age;
    this.gender = user.gender;
    this.interests = user.interests;
    this.preferences = user.preferences;
    this.bio = user.bio;
    this.phone = user.phone;
    this.address = user.address;
    this.joined = user.createdAt;
    this.onboarding = user.onboardingCompleted ? undefined : true;
    this.role = 'member';

    this.location = user.location?.displayName;

    this.stats = {
      matches: user.matches ? user.matches.length : 0,
      likes: user.likes ? user.likes.length : 0,
      activeDays: user.createdAt
        ? Math.floor(
            (Date.now() - new Date(user.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0,
    };

    this.distance = '10km away';
  }
}

export default UserDTO;
