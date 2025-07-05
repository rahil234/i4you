import { MatchModel, MatchDocument } from '@/models/match.model';
import IUserRepository from '@/repositories/interfaces/IMatchRepository';
import { BaseRepository } from '@/repositories/base.repository';
import { injectable } from 'inversify';

@injectable()
export class MatchRepository
  extends BaseRepository<MatchDocument>
  implements IUserRepository
{
  constructor() {
    super(MatchModel);
  }

  async findByEmail(email: string): Promise<MatchDocument | null> {
    return this.model.findOne({ email }).exec();
  }

  async getMatches(userId: string): Promise<MatchDocument[]> {
    const user = await MatchModel.findById(userId);
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

    return MatchModel.aggregate([
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
  }
}
