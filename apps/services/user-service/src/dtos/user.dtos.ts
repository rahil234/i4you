import { UserPreferences } from '@i4you/shared';
import { User } from '@/entities/user.entity';
import { Subscription } from '@/types';

class UserDTO
  implements
    Omit<
      User,
      | 'location'
      | 'onboardingCompleted'
      | 'password'
      | 'createdAt'
      | 'updatedAt'
    >
{
  id: string;
  name: string;
  email: string;
  age: number;
  avatar?: string;
  gender: 'male' | 'female' | 'other';
  bio: string;
  role: 'admin' | 'member';
  onboarding?: boolean;
  interests: string[];
  photos: string[];
  subscription: {
    planId: string;
    status: string;
  };
  stats?: {
    matches: number;
    likes: number;
    activeDays: number;
  };
  location: string;
  preferences: UserPreferences;
  joined: string;
  status: 'active' | 'suspended';

  constructor(user: User, subscription: Subscription, photos?: string[]) {
    this.id = user.id.toString();
    this.name = user.name;
    this.email = user.email;
    this.avatar = photos ? photos[0] : '/default-avatar.png';
    this.photos = photos ?? [];
    this.status = user.status;
    this.age = user.age;
    this.gender = user.gender;
    this.subscription = subscription;
    this.interests = user.interests;
    this.preferences = user.preferences;
    this.bio = user.bio;
    this.joined = user.createdAt.toString();
    this.onboarding = user.onboardingCompleted ? undefined : true;
    this.role = 'member';

    this.location = user.location?.displayName;

    this.stats = {
      matches: 0,
      likes: 0,
      activeDays: user.createdAt
        ? Math.floor(
            (Date.now() - new Date(user.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0,
    };
  }
}

export default UserDTO;
