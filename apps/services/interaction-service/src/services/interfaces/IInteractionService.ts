import { CreateInteractionDTO } from '@/dtos/interaction.dto';

export interface IInteractionService {
  createInteraction(data: CreateInteractionDTO): Promise<void>;
}
