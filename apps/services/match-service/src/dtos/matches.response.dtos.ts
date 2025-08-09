import { User } from '@i4you/shared';

class MatchesResponseDTO
  implements
    Omit<
      User,
      | 'location'
      | 'joined'
      | 'email'
      | 'status'
      | 'role'
      | 'preferences'
      | 'onboardingCompleted'
    >
{
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  photos: string[];
  interests: string[];
  location: string;
  distance: string;

  constructor(match: any, photos: string[]) {
    this.id = match.id;
    this.name = match.name;
    this.age = match.age;
    this.gender = match.gender;
    this.bio = match.bio;
    this.photos = photos;
    this.interests = match.interests;
    this.location = match.location?.displayName || 'Unknown location';
    this.distance = `${Math.ceil(match.distance)} Km`;
  }
}

export default MatchesResponseDTO;
