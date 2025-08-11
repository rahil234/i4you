import { injectable } from 'inversify';
import { GetPotentialMatchesRequest, GetPotentialMatchesResponse } from '@i4you/proto-files/discovery/v2';
import elastic from '@/config/elastic';

@injectable()
export class DiscoveryService {

  async getPotentialMatches(data: GetPotentialMatchesRequest): Promise<GetPotentialMatchesResponse> {
    console.log('Received getPotentialMatches request:', data);

    const result = await elastic.search({
      index: 'users',
      _source: ['id', 'name', 'email', 'gender', 'interests', 'age', 'photos', 'location'],
      _source_excludes: ['location._id'],
      query: {
        bool: {
          must: [
            ...(data.showMe ? [{ match: { gender: data.showMe } }] : []),
            {
              range: {
                age: {
                  gte: data.minAge,
                  lte: data.maxAge,
                },
              },
            },
          ],
          filter: {
            geo_distance: {
              distance: `${data.maxDistance}km`,
              'location.coordinates': {
                lon: data.locationLng,
                lat: data.locationLat,
              },
            },
          },
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
            source: 'doc[\'location.coordinates\'].arcDistance(params.lat, params.lon)',
          },
        },
      },
    });

    const hits = result.hits.hits.map((hit: any) => {
      return {
        ...hit._source,
        photos: [],
        distance: hit.fields.distance ? (hit.fields.distance[0] * 0.001) : undefined,
      };
    });

    console.log('Filtered Hits:', hits);

    return {
      matches: hits,
    };
  }
}
