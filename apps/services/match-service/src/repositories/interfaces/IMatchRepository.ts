import { MatchDocument } from '@/models/match.model';

export interface IMatchRepository {
  createMatch(userId1: string, userId2: string): Promise<MatchDocument>;

  getMatches(userId: string): Promise<MatchDocument[]>;

  isMatchExists(userId1: string, userId2: string): Promise<boolean>;

  getBlockedMatches(userId: string): Promise<MatchDocument[]>;

  blockMatch(userId: string, matchId: string): Promise<boolean>;

  unblockMatch(userId: string, matchId: string): Promise<boolean>;
}
