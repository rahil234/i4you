import { GetPotentialMatchesRequest, GetPotentialMatchesResponse } from '@i4you/proto-files/discovery/v2';

export interface IDiscoveryService {
  getPotentialMatches(data: GetPotentialMatchesRequest): Promise<GetPotentialMatchesResponse>;
}
