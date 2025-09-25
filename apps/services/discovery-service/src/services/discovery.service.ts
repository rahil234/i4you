import { injectable } from 'inversify';
import {
  GetPotentialMatchesRequest,
  GetPotentialMatchesResponse,
} from '@i4you/proto-files/discovery/v2';
import elastic from '@/config/elastic';
import { IDiscoveryService } from '@/services/interfaces/IDiscoverService';

@injectable()
export class DiscoveryService implements IDiscoveryService {
  async getPotentialMatches(
    data: GetPotentialMatchesRequest,
  ): Promise<GetPotentialMatchesResponse> {
    const result = await elastic.search({
      index: 'users',
      _source: [
        'id',
        'name',
        'email',
        'gender',
        'interests',
        'age',
        'photos',
        'location',
      ],
      _source_excludes: ['location._id'],
      query: {
        bool: {
          filter: [
            ...(data.showMe && data.showMe !== 'all'
              ? [{ term: { gender: data.showMe } }]
              : []),
            ...(data.lookingFor && data.lookingFor !== 'all'
              ? [{ term: { 'preferences.lookingFor': data.lookingFor } }]
              : []),
            {
              range: {
                age: {
                  gte: data.minAge,
                  lte: data.maxAge,
                },
              },
            },
            {
              geo_distance: {
                distance: `${data.maxDistance}km`,
                'location.coordinates': {
                  lon: data.locationLng,
                  lat: data.locationLat,
                },
              },
            },
          ],
          must_not: [
            {
              terms: {
                id: data.excludeUserIds || [],
              },
            },
          ],
        },
      },
      script_fields: {
        distance: {
          script: {
            lang: 'painless',
            params: {
              lon: data.locationLng,
              lat: data.locationLat,
            },
            source:
              "doc['location.coordinates'].arcDistance(params.lat, params.lon)",
          },
        },
      },
    });

    const hits = result.hits.hits.map((hit) => ({
      ...(hit._source as any),
      photos: [],
      distance: hit?.fields?.distance
        ? hit?.fields?.distance[0] * 0.001
        : undefined,
    }));

    return {
      matches: hits,
    };
  }
}
