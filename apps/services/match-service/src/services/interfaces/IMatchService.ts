import { Match } from '@/types';

export interface IMatchService {
  getMatches(userId: string): Promise<Match[]>;

  getPotentialMatches(userId: string): Promise<Match[]>;

  userMatched(userA: string, userB: string): Promise<void>;

  getBlockedMatches(userId: string): Promise<Match[]>;

  blockMatch(userId: string, matchId: string): Promise<void>;

  unblockMatch(userId: string, matchId: string): Promise<void>;
}
