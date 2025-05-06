import { UserModel, UserDocument } from '@/models/user.model';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { BaseRepository } from '@/repositories/base.repository';
import { injectable } from 'inversify';

@injectable()
export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).exec();
  }

  // async getMatches(userId: string): Promise<UserDocument[]> {
  //   console.log('Fetching matches for user:', userId);
  //   return this.model
  //     .find({ _id: { $ne: userId }, onboardingCompleted: true })
  //     .exec();
  // }

  async getMatches(userId: string): Promise<UserDocument[]> {
    console.log('Fetching matches for user:', userId);

    const user = await UserModel.findById(userId);
    const coords = user?.location?.coordinates;
    const maxDistanceKm = user?.preferences?.distance;
    const ageRange = user?.preferences?.ageRange;
    const showMe = user?.preferences?.showMe;

    if (!coords || !maxDistanceKm || !ageRange || !showMe) {
      throw new Error('User location or preferences not found');
    }

    const maxDistanceMeters = maxDistanceKm * 1000;

    const genderFilter =
      showMe === 'all' ? { $in: ['male', 'female', 'other'] } : showMe;

    const matches = await UserModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: coords,
          },
          distanceField: 'distance',
          spherical: true,
          query: {
            _id: { $ne: user._id },
            onboardingCompleted: true,
          },
        },
      },
      {
        $match: {
          distance: { $lte: maxDistanceMeters },
          age: { $gte: ageRange[0], $lte: ageRange[1] },
          gender: genderFilter,
          // 'preferences.showMe':
          //   user.gender === 'other' ? 'all' : { $in: [user.gender, 'all'] },
        },
      },
    ]);

    console.log('Matches found:', matches);

    return matches;
  }
}
