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

    if (!coords || !maxDistanceKm) {
      throw new Error('User location or preference distance not found');
    }

    const maxDistanceMeters = maxDistanceKm * 1000;

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
        },
      },
    ]);

    console.log('Matches found:', matches);

    return matches;
  }
}
