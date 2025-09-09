import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { Interaction } from '@/entities/interaction.entity';

export interface IInteractionService {
  createInteraction(data: CreateInteractionDTO): Promise<void>;
}
