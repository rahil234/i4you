import IBaseRepository from '@/repositories/interfaces/IBaseRepositoryInterface';
import { ModerationDocument } from '@/models/moderation.model';

interface IModerationRepository extends IBaseRepository<ModerationDocument> {
  findByEmail(email: string): Promise<ModerationDocument | null>;
}

export default IModerationRepository;
