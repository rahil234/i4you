import { IInteractionRepository } from '@/repositories/interfaces/IInteractionRepository';
import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { createError } from '@i4you/http-errors';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';
import { INTERACTION } from '@/constants/interactions.constant';
import { INTERACTION_RESPONSE_MESSAGES } from '@/constants/response-messages.constant';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { EVENT_KEYS, EVENT_TOPICS } from '@/constants/events.constant';

@injectable()
export class InteractionService implements IInteractionService {
  constructor(
    @inject(TYPES.InteractionRepository)
    private _interactionRepository: IInteractionRepository,
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

    const reciprocal = await this._interactionRepository.create(data);

    if (data.type === INTERACTION.LIKE || data.type === INTERACTION.SUPERLIKE) {
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
}
