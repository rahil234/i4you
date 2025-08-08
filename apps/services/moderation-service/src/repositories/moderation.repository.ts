import { ModerationModel, ModerationDocument } from '@/models/moderation.model';
import IModerationRepository from '@/repositories/interfaces/IModerationRepository';
import { BaseRepository } from '@/repositories/base.repository';

export class ModerationRepository
  extends BaseRepository<ModerationDocument>
  implements IModerationRepository {
  constructor() {
    super(ModerationModel);
  }

  async findByEmail(email: string): Promise<ModerationDocument | null> {
    return this.model.findOne({ email }).exec();
  }
}
