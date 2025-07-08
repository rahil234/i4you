import { MatchDocument } from '@/models/match.model';

export default interface IMatchRepository {
  createMatch(userId1: string, userId2: string): Promise<MatchDocument>;

  getMatches(userId: string): Promise<MatchDocument[]>;

  isMatchExists(userId1: string, userId2: string): Promise<boolean>;
}
