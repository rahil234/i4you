import { IInteractionRepository } from '@/repositories/interfaces/IInteractionRepository';
import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { Interaction } from '@/entities/interaction.entity';
import { createError } from '@i4you/http-errors';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';

@injectable()
export class InteractionService implements IInteractionService {
  constructor(
    @inject(TYPES.InteractionRepository)
    private readonly _interactionRepository: IInteractionRepository
  ) {}

  async createInteraction(data: CreateInteractionDTO): Promise<Interaction> {
    if (data.fromUserId === data.toUserId) {
      createError.BadRequest('Cannot interact with yourself');
    }

    const existing = await this._interactionRepository.findByUsers(
      data.fromUserId,
      data.toUserId
    );
    if (existing) {
      createError.BadRequest('Interaction already exists');
    }

    return await this._interactionRepository.create(data);
  }
}
