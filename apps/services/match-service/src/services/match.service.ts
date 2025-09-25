import { injectable, inject } from 'inversify';
import { Match, MatchEventPayload, TYPES } from '@/types';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { IMatchRepository } from '@/repositories/interfaces/IMatchRepository';
import { createError } from '@i4you/http-errors';
import { EVENT_KEYS, EVENT_TOPICS } from '@/constants/events.constant';
import { IMatchService } from '@/services/interfaces/IMatchService';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { IUserService } from '@/services/interfaces/IUserService';
import { IDiscoveryService } from '@/services/interfaces/IDiscoveryService';

@injectable()
export class MatchService implements IMatchService {
  constructor(
    @inject(TYPES.MatchRepository) private _matchRepository: IMatchRepository,
    @inject(TYPES.InteractionService)
    private _interactionService: IInteractionService,
    @inject(TYPES.UserGrpcService) private _userGrpcService: IUserService,
    @inject(TYPES.KafkaService) private _kafkaService: IKafkaService,
    @inject(TYPES.DiscoveryGrpcService)
    private _discoverGrpcService: IDiscoveryService
  ) {}

  async getMatches(userId: string): Promise<Match[]> {
    try {
      const matches = await this._matchRepository.getMatches(userId);

      // TODO: Add pagination and sorting
      // @ts-expect-error some properties are optional
      return Promise.all(
        matches.map(async (match) => {
          const matchId = String(
            String(match.userA) === userId ? match.userB : match.userA
          );

          const userData = await this._userGrpcService.findUserById(matchId);

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
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getPotentialMatches(userId: string): Promise<Match[]> {
    const user = await this._userGrpcService.findUserById(userId);

    const likedUserIds =
      await this._interactionService.getInteractedUserIds(userId);

    const excludeUserIds = [userId, ...likedUserIds];

    return this._discoverGrpcService.getMatches({
      preferences: user.preferences!,
      location: user.location!,
      excludeUserIds,
    });
  }

  async userMatched(userA: string, userB: string) {
    const user1 = await this._userGrpcService.findUserById(userA);
    const user2 = await this._userGrpcService.findUserById(userB);

    if (!user1 || !user2) {
      createError.BadRequest('One or both users not found');
    }

    console.log(`User ${user1.name} matched with user ${user2.id}`);

    const alreadyMatched = await this._matchRepository.isMatchExists(
      user1.id,
      user2.id
    );

    if (alreadyMatched) {
      console.log(
        `✅ Match already exists between ${user1.id} and ${user2.id}, skipping.`
      );
      return;
    }

    const match = await this._matchRepository.createMatch(user1.id, user2.id);

    await this._kafkaService.emit(
      EVENT_TOPICS.NOTIFICATION_EVENTS,
      EVENT_KEYS.USER_MATCHED,
      {
        recipientId: user1.id,
        data: {
          userId: user2.id,
          matchedUserId: user2.id,
          name: user2.name,
          photo: user2.photos[0],
          timestamp: new Date(),
        },
      } as MatchEventPayload
    );

    await this._kafkaService.emit(
      EVENT_TOPICS.NOTIFICATION_EVENTS,
      EVENT_KEYS.USER_MATCHED,
      {
        recipientId: user2.id,
        data: {
          userId: user1.id,
          matchedUserId: user1.id,
          name: user1.name,
          photo: user1.photos[0],
          timestamp: new Date(),
        },
      } as MatchEventPayload
    );

    console.log(
      `✅ Match created between ${match.userA} and ${match.userB} and notifications sent.`
    );
  }

  async getBlockedMatches(userId: string): Promise<Match[]> {
    try {
      const blockedMatches =
        await this._matchRepository.getBlockedMatches(userId);

      // TODO: Add pagination and sorting
      // @ts-expect-error some properties are optional
      return Promise.all(
        blockedMatches.map(async (match) => {
          const matchId = String(
            String(match.userA) === userId ? match.userB : match.userA
          );

          const userData = await this._userGrpcService.findUserById(matchId);

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
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async blockMatch(userId: string, matchId: string): Promise<void> {
    console.log(`Blocking match between user ${userId} and match ${matchId}`);
    await this._matchRepository.blockMatch(userId, matchId);
    console.log(`Match between user ${userId} and match ${matchId} blocked`);
  }

  async unblockMatch(userId: string, matchId: string): Promise<void> {
    console.log(`Unblocking match between user ${userId} and match ${matchId}`);
    await this._matchRepository.unblockMatch(userId, matchId);
    console.log(`Match between user ${userId} and match ${matchId} unblocked`);
  }
}
