import mongoose from 'mongoose';
import { injectable } from 'inversify';
import { ILikeRepository } from '@/repositories/interfaces/ILikeRepository';
import { BaseRepository } from '@/repositories/base.repository';
import { LikeModel, LikeDocument } from '@/models/like.model';

@injectable()
export class LikeRepository
  extends BaseRepository<LikeDocument>
  implements ILikeRepository
{
  constructor() {
    super(LikeModel);
  }

  // Check if likedUser has already liked userId (i.e., mutual like)
  async checkIfUserLiked(
    likedUserId: string,
    userId: string
  ): Promise<boolean> {
    const like = await LikeModel.findOne({
      fromUserId: new mongoose.Types.ObjectId(likedUserId),
      toUserId: new mongoose.Types.ObjectId(userId),
    }).exec();

    return !!like;
  }

  // Save a one-sided like
  async saveLike(fromUserId: string, toUserId: string): Promise<LikeDocument> {
    const like = new LikeModel({
      fromUserId: new mongoose.Types.ObjectId(fromUserId),
      toUserId: new mongoose.Types.ObjectId(toUserId),
    });

    return await like.save();
  }

  // Optional: Get all likes sent by a user
  async getLikesSent(userId: string): Promise<LikeDocument[]> {
    return LikeModel.find({ fromUserId: userId }).exec();
  }

  // Optional: Get all users who liked this user
  async getLikesReceived(userId: string): Promise<LikeDocument[]> {
    return LikeModel.find({ toUserId: userId }).exec();
  }
}
