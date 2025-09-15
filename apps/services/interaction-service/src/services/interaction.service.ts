import { IInteractionRepository } from '@/repositories/interfaces/IInteractionRepository';
import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { createError } from '@i4you/http-errors';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { inject, injectable } from 'inversify';
import { InteractionBalances, TYPES } from '@/types';
import { INTERACTION } from '@/constants/interactions.constant';
import { INTERACTION_RESPONSE_MESSAGES } from '@/constants/response-messages.constant';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { EVENT_KEYS, EVENT_TOPICS } from '@/constants/events.constant';
import { IGRPCInteractionService } from '@/services/interfaces/IGRPCInteractionService';
import { ITokenService } from '@/services/interfaces/ITokenService';

@injectable()
export class InteractionService
  implements IInteractionService, IGRPCInteractionService
{
  constructor(
    @inject(TYPES.InteractionRepository)
    private _interactionRepository: IInteractionRepository,
    @inject(TYPES.TokenService)
    private _tokenService: ITokenService,
    @inject(TYPES.KafkaService) private _kafkaService: IKafkaService
  ) {}

  async createInteraction(data: CreateInteractionDTO): Promise<void> {
    if (data.fromUserId === data.toUserId) {
      createError.BadRequest(
        INTERACTION_RESPONSE_MESSAGES.SELF_INTERACTION_NOT_ALLOWED
      );
    }

    const existing = await this._interactionRepository.findByUsers(
      data.fromUserId,
      data.toUserId
    );

    if (existing) {
      createError.BadRequest(INTERACTION_RESPONSE_MESSAGES.ALREADY_EXISTS);
    }

    let res = true;

    switch (data.type) {
      case INTERACTION.LIKE:
        res = await this._tokenService.consumeLike(data.fromUserId);
        break;
      case INTERACTION.SUPERLIKE:
        res = await this._tokenService.consumeSuperLike(data.fromUserId);
        break;
    }

    if (!res) {
      throw createError.BadRequest(
        INTERACTION_RESPONSE_MESSAGES.INSUFFICIENT_TOKENS
      );
    }
    await this._interactionRepository.create(data);

    if (data.type === INTERACTION.LIKE || data.type === INTERACTION.SUPERLIKE) {
      const reciprocal = await this._interactionRepository.findByUsers(
        data.toUserId,
        data.fromUserId
      );

      if (
        reciprocal &&
        (reciprocal.type === INTERACTION.LIKE ||
          reciprocal.type === INTERACTION.SUPERLIKE)
      ) {
        console.log(
          INTERACTION_RESPONSE_MESSAGES.MATCH_CREATED,
          data.fromUserId,
          'and',
          data.toUserId
        );

        await this._kafkaService.emit(
          EVENT_TOPICS.MATCH_EVENTS,
          EVENT_KEYS.USER_MATCHED,
          {
            user1: data.fromUserId,
            user2: data.toUserId,
            timestamp: new Date().toISOString(),
          }
        );
      }
    }
  }

  async getAlreadyInteractedUsers(userId: string): Promise<string[]> {
    const interactions =
      await this._interactionRepository.findByOfUserById(userId);
    return interactions.map((interaction) => interaction.toUserId);
  }

  async getInteractionBalances(userId: string): Promise<InteractionBalances> {
    const {
      superLikes,
      likes,
      nextRefill: refill_time,
    } = await this._tokenService.getTokenDetailsByUserId(userId);

    return {
      likes,
      superLikes,
      refill_time,
    };
  }
}
