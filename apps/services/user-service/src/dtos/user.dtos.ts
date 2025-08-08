import { User, UserPreferences } from '@i4you/shared';
import { UserDocument } from '@/models/user.model';

class UserDTO implements Omit<User, 'location' | 'onboardingCompleted'> {
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
  joined: string;
  status: 'active' | 'suspended';

  constructor(user: UserDocument, photos?: string[]) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.avatar = photos ? photos[0] : user.photos[2];
    this.photos = photos ?? user.photos;
    this.status = user.status;
    this.age = user.age;
    this.gender = user.gender;
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
