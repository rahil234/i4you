import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import ILikeRepository from '@/repositories/interfaces/ILikeRepository';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';
import { UserGrpcService } from '@/services/user.grpc.service';
import { User } from '@i4you/proto-files/generated/user/v2/user';

export interface Match {
  id: string;
  matchedUserId: string;
  createdAt: string;
  user: Omit<
    Partial<User>,
    | 'password'
    | 'email'
    | 'onboardingCompleted'
    | 'gender'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  >;
}

@injectable()
export class MatchService {
  constructor(
    @inject(TYPES.KafkaService) private kafkaService: IKafkaService,
    @inject(TYPES.MatchRepository) private matchRepository: IMatchRepository,
    @inject(TYPES.LikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.UserGrpcService) private userGrpcService: UserGrpcService
  ) {}

  async getMatches(userId: string): Promise<Match[]> {
    console.log(`Fetching matches for user ${userId}`);

    try {
      const matches = await this.matchRepository.getMatches(userId);
      console.log(`Found ${matches.length} matches for user ${userId}`);

      console.log(
        `Fetching user details for ${matches.length} matches...`,
        matches
      );

      const populatedMatches = await Promise.all(
        matches.map(async (match) => {
          const matchId = String(
            String(match.userA) === userId ? match.userB : match.userA
          );

          const userData = await this.userGrpcService.findUserById(matchId);

          console.log(`Fetched user data for match ${matchId}:`, userData.id);

          return {
            id: match.id,
            matchedUserId: matchId,
            createdAt: match.createdAt.toISOString(),
            user: {
              id: userData.user?.id,
              name: userData.user?.name,
              age: userData.user?.age,
              bio: userData.user?.bio,
              location: userData.user?.location,
              photos: userData.user?.photos || [],
              interests: userData.user?.interests || [],
            },
          };
        })
      );

      console.log('populatedMatches:', populatedMatches);

      return populatedMatches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

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
