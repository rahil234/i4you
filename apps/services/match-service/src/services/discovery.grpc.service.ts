import { injectable, inject } from 'inversify';
import { GetMatchesRequest, Match, TYPES } from '@/types';
import { DiscoveryGrpcProvider } from '@/providers/discovery.grpc.provider';
import { IDiscoveryService } from '@/services/interfaces/IDiscoveryService';

@injectable()
export class DiscoveryGrpcService implements IDiscoveryService {
  constructor(
    @inject(TYPES.DiscoveryGrpcProvider)
    private discoveryServiceClient: DiscoveryGrpcProvider
  ) {}

  async getMatches({
    preferences,
    location,
    excludeUserIds = [],
  }: GetMatchesRequest): Promise<Match[]> {
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
          resolve(response.matches as unknown as Match[]);
        }
      );
    });
  }
}
