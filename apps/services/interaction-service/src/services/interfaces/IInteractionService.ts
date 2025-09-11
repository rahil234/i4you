import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { InteractionBalances } from '@/types';

export interface IInteractionService {
  createInteraction(data: CreateInteractionDTO): Promise<void>;
  getInteractionBalances(userId: string): Promise<InteractionBalances>;
}
