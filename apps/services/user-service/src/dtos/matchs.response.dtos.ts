import { User } from '@repo/shared';

class MatchesResponseDTO
  implements
    Omit<
      User,
      'location' | 'joined' | 'email' | 'status' | 'role' | 'preferences'
    >
{
  id;
  name;
  age;
  gender: 'male' | 'female' | 'other';
  bio;
  photos;
  interests;
  location;
  distance: string;

  constructor(match: any, userLocation: [number, number]) {
    this.id = match._id;
    this.name = match.name;
    this.age = match.age;
    this.gender = match.gender;
    this.bio = match.bio;
    this.photos = match.photos;
    this.interests = match.interests;
    this.location = match.location?.displayName || 'Unknown location';

    // const distance = getDistanceInKm(match.location?.coordinates, userLocation);
    //
    // this.distance = `${distance.toFixed(2)} km`;
    this.distance = `${Math.ceil(match.distance / 1000)} Km`;
  }
}

export default MatchesResponseDTO;
