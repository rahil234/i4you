import { LikeDocument } from '@/models/like.model';

export default interface ILikeRepository {
  checkIfUserLiked(likedUserId: string, userId: string): Promise<boolean>;
  saveLike(fromUserId: string, toUserId: string): Promise<LikeDocument>;
  getLikesSent(userId: string): Promise<LikeDocument[]>;
  getLikesReceived(userId: string): Promise<LikeDocument[]>;
}