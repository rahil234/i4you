import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import { DiscoveryGrpcProvider } from '@/providers/discovery.grpc.provider';
import { GetPotentialMatchesResponse } from '@i4you/proto-files/discovery/v2';
import { Preferences, Location } from '@i4you/proto-files/user/v2';

interface GetMatchesRequest {
  preferences: Preferences;
  location: Location;
  excludeUserIds?: string[];
}

@injectable()
export class DiscoveryGrpcService {
  constructor(
    @inject(TYPES.DiscoveryGrpcProvider)
    private discoveryServiceClient: DiscoveryGrpcProvider
  ) {}

  async getMatches({
    preferences,
    location,
    excludeUserIds = [],
  }: GetMatchesRequest): Promise<GetPotentialMatchesResponse> {
    return new Promise((resolve, reject) => {
      this.discoveryServiceClient.getPotentialMatches(
        {
          showMe: preferences.showMe,
          maxDistance: preferences.distance,
          lookingFor: preferences.lookingFor,
          minAge: preferences.ageRange[0],
          maxAge: preferences.ageRange[1],
          locationLng: location.coordinates[0],
          locationLat: location.coordinates[1],
          excludeUserIds,
        },
        (err, response) => {
          if (err) return reject(err);
          resolve(response);
        }
      );
    });
  }
}
