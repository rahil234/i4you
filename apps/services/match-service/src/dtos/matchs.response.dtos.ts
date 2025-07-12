import { User } from '@i4you/shared';

export class MatchesResponseDTO
  implements
    Omit<
      User,
      | 'location'
      | 'joined'
      | 'email'
      | 'status'
      | 'role'
      | 'preferences'
      | 'photos'
    >
{
  id;
  name;
  age;
  gender: 'male' | 'female' | 'other';
  bio;
  avatar?: string;
  interests;
  location;
  distance: string;

  constructor(match: any, userLocation: [number, number]) {
    this.id = match._id;
    this.name = match.name;
    this.age = match.age;
    this.gender = match.gender;
    this.bio = match.bio;
    this.avatar = match.photos[0];
    this.interests = match.interests;
    this.location = match.location?.displayName || 'Unknown location';

    this.distance = `${Math.ceil(match.distance / 1000)} Km`;
  }
}
