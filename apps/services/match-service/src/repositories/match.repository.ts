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

  async getBlockedMatches(userId: string): Promise<MatchDocument[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return await MatchModel.find({
      status: 'blocked',
      $or: [{ userA: userObjectId }, { userB: userObjectId }],
    }).exec();
  }

  async blockMatch(userId: string, matchId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const matchObjectId = new mongoose.Types.ObjectId(matchId);

    const match = await MatchModel.findOne({
      _id: matchObjectId,
      $or: [{ userA: userObjectId }, { userB: userObjectId }],
    });

    if (!match) {
      throw new Error('Match not found or access denied');
    }

    match.status = 'blocked';
    await match.save();
    return true;
  }

  async unblockMatch(userId: string, matchId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const matchObjectId = new mongoose.Types.ObjectId(matchId);

    const match = await MatchModel.findOne({
      _id: matchObjectId,
      $or: [{ userA: userObjectId }, { userB: userObjectId }],
    });

    if (!match) {
      throw new Error('Match not found or access denied');
    }

    match.status = 'matched';
    await match.save();
    return true;
  }
}
