import { User } from '@repo/shared';

class OnboardingRequestDTO
  implements Omit<User, 'id' | 'joined' | 'email' | 'status' | 'role'>
{
  name;
  age;
  gender;
  bio;
  photos;
  interests;
  location;
  preferences;

  constructor(user: any) {
    this.name = user.name;
    this.age = user.age;
    this.gender = user.gender;
    this.bio = user.bio;
    this.photos = user.photos;
    this.interests = user.interests;
    this.preferences = user.preferences;

    this.location = {
      type: 'Point' as const,
      coordinates: user.location.coordinates,
      displayName: user.location.displayName,
    };
  }
}

export default OnboardingRequestDTO;
