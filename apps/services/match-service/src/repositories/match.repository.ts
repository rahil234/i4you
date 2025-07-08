import { MatchModel, MatchDocument } from '@/models/match.model';
import { BaseRepository } from '@/repositories/base.repository';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import { injectable } from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class MatchRepository
  extends BaseRepository<MatchDocument>
  implements IMatchRepository
{
  constructor() {
    super(MatchModel);
  }

  /**
   * Create a new match between two users (sorted order).
   */
  async createMatch(userId1: string, userId2: string): Promise<MatchDocument> {
    const [userA, userB] =
      userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const match = new MatchModel({
      userA: new mongoose.Types.ObjectId(userA),
      userB: new mongoose.Types.ObjectId(userB),
      status: 'matched',
    });

    return await match.save();
  }

  /**
   * Get all matches for a given user.
   */
  async getMatches(userId: string): Promise<MatchDocument[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return await MatchModel.find({
      status: 'matched',
      $or: [{ userA: userObjectId }, { userB: userObjectId }],
    }).exec();
  }

  /**
   * (Optional) Check if a match already exists
   */
  async isMatchExists(userId1: string, userId2: string): Promise<boolean> {
    const [userA, userB] =
      userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const match = await MatchModel.findOne({
      userA,
      userB,
      status: 'matched',
    });

    return !!match;
  }
}
