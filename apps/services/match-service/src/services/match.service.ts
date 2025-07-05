import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';

@injectable()
export class MatchService {
  constructor() // @inject(TYPES.KafkaService) private kafkaService: IKafkaService // @inject(TYPES.MatchRepository) private matchRepository: IMatchRepository,
  {}

  async handleLike(userId: string, likedUserId: string): Promise<void> {
    console.log(`User ${userId} liked user ${likedUserId}`);
    // const isMutual = await this.matchRepository.checkIfUserLiked(likedUserId, userId);
    //
    // if (isMutual) {
    //   const match = await this.matchRepository.createMatch(userId, likedUserId);
    //
    //   // Emit match_found event
    //   await this.kafkaService.emit('match-events', 'match_found', {
    //     user1: userId,
    //     user2: likedUserId,
    //     matchId: match.id,
    //     timestamp: new Date().toISOString(),
    //   });
    //
    //   console.log(`Match created between ${userId} and ${likedUserId}`);
    // } else {
    //   // Just store the like (one-sided)
    //   await this.matchRepository.saveLike(userId, likedUserId);
    //   console.log(`${userId} liked ${likedUserId}, waiting for mutual.`);
    // }
  }
}
