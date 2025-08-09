import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import { DiscoveryGrpcService } from '@/services/discovery.grpc.service';
import { UserGrpcService } from '@/services/user.grpc.service';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import ILikeRepository from '@/repositories/interfaces/ILikeRepository';
import { User } from '@i4you/shared';

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
    @inject(TYPES.UserGrpcService) private userGrpcService: UserGrpcService,
    @inject(TYPES.DiscoveryGrpcService)
    private discoverGrpcService: DiscoveryGrpcService
  ) {}

  async getMatches(userId: string): Promise<Match[]> {
    try {
      const matches = await this.matchRepository.getMatches(userId);

      const populatedMatches = await Promise.all(
        matches.map(async (match) => {
          const matchId = String(
            String(match.userA) === userId ? match.userB : match.userA
          );

          const userData = await this.userGrpcService.findUserById(matchId);

          return {
            id: match.id,
            matchedUserId: matchId,
            createdAt: match.createdAt.toISOString(),
            user: {
              id: userData.id,
              name: userData.name,
              age: userData.age,
              bio: userData.bio,
              location: userData.location?.displayName,
              avatar: userData.photos[0],
              interests: userData.interests || [],
            },
          };
        })
      );

      // TODO: Add pagination and sorting
      // @ts-expect-error some properties are optional
      return populatedMatches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getPotentialMatches(userId: string) {
    const user = await this.userGrpcService.findUserById(userId);

    const likedUserIds = (await this.likeRepository.getLikesSent(userId)).map(
      (d) => d.toUserId.toString()
    );

    const excludeUserIds = [userId, ...likedUserIds];

    console.log('likedUserIds:', excludeUserIds);

    const { matches } = await this.discoverGrpcService.getMatches({
      preferences: user.preferences!,
      location: user.location!,
      excludeUserIds,
    });

    return matches;
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
