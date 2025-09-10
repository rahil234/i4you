import { Interaction } from '@/entities/interaction.entity';
import { CreateInteractionDTO } from '@/dtos/interaction.dto';

export interface IInteractionRepository {
  create(data: CreateInteractionDTO): Promise<Interaction>;
  findByUsers(
    fromUserId: string,
    toUserId: string
  ): Promise<Interaction | null>;
  findByOfUserById(fromUserId: string): Promise<Interaction[]>;
  delete(fromUserId: string, toUserId: string): Promise<void>;
}
