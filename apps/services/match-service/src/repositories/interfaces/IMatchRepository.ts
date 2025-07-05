import IBaseRepository from '@/repositories/interfaces/IBaseRepositoryInterface';
import { MatchDocument } from '@/models/match.model';

interface MatchRepository extends IBaseRepository<MatchDocument> {
  findByEmail(email: string): Promise<MatchDocument | null>;

  getMatches(userId: string): Promise<MatchDocument[]>;
}

export default MatchRepository;
