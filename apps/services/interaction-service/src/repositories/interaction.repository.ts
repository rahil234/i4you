import { IInteractionRepository } from '@/repositories/interfaces/IInteractionRepository';
import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { Interaction } from '@/entities/interaction.entity';
import { InteractionModel } from '@/models/interaction.model';
import { injectable } from 'inversify';

@injectable()
export class MongoInteractionRepository implements IInteractionRepository {
  async create(data: CreateInteractionDTO): Promise<Interaction> {
    const doc = await InteractionModel.create(data);
    return new Interaction(
      doc.id,
      doc.fromUserId,
      doc.toUserId,
      doc.type,
      doc.createdAt
    );
  }

  async findByUsers(
    fromUserId: string,
    toUserId: string
  ): Promise<Interaction | null> {
    const doc = await InteractionModel.findOne({ fromUserId, toUserId });
    if (!doc) return null;
    return new Interaction(
      doc.id,
      doc.fromUserId,
      doc.toUserId,
      doc.type,
      doc.createdAt
    );
  }

  async delete(fromUserId: string, toUserId: string): Promise<void> {
    await InteractionModel.deleteOne({ fromUserId, toUserId });
  }

  async findByOfUserById(fromUserId: string): Promise<Interaction[]> {
    return InteractionModel.find({ fromUserId }).then((docs) =>
      docs.map(
        (doc) =>
          new Interaction(
            doc.id,
            doc.fromUserId,
            doc.toUserId,
            doc.type,
            doc.createdAt
          )
      )
    );
  }
}
