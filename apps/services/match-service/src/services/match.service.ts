import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import ILikeRepository from '@/repositories/interfaces/ILikeRepository';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';

@injectable()
export class MatchService {
  constructor(
    @inject(TYPES.KafkaService) private kafkaService: IKafkaService,
    @inject(TYPES.MatchRepository) private matchRepository: IMatchRepository,
    @inject(TYPES.LikeRepository) private likeRepository: ILikeRepository
  ) {}

  async handleLike(userId: string, likedUserId: string): Promise<void> {
    console.log(`User ${userId} liked user ${likedUserId}`);

    try {
      const isMutual = await this.likeRepository.checkIfUserLiked(
        likedUserId,
        userId
      );

      if (isMutual) {
        const alreadyMatched = await this.matchRepository.isMatchExists(
          userId,
          likedUserId
        );

        if (alreadyMatched) {
          console.log(
            `✅ Match already exists between ${userId} and ${likedUserId}`
          );
          return;
        }

        await this.likeRepository.saveLike(userId, likedUserId);

        const match = await this.matchRepository.createMatch(
          userId,
          likedUserId
        );

        await this.kafkaService.emit('match.events', 'match_found', {
          user1: userId,
          user2: likedUserId,
          matchId: match.id,
          timestamp: new Date().toISOString(),
        });

        console.log(`✅ Match created between ${userId} and ${likedUserId}`);
      } else {
        await this.likeRepository.saveLike(userId, likedUserId);
        console.log(`🕒 ${userId} liked ${likedUserId}, waiting for mutual.`);
      }
    } catch (error: any) {
      if (error.code == 11000) {
        console.log('⚠️ Duplicate like detected. Ignoring.');
        return;
      }

      console.error('❌ Unexpected error:', error);
      // ❌ DO NOT throw again — or it will retry forever
      // Optionally send to DLQ or alert
    }
  }
}
