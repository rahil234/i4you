import { GetMatchesRequest, Match } from '@/types';

export interface IDiscoveryService {
  getMatches(p: GetMatchesRequest): Promise<Match[]>;
}
