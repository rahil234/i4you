import { injectable } from 'inversify';
import { GetPotentialMatchesRequest, GetPotentialMatchesResponse } from '@i4you/proto-files/discovery/v2';
import elastic from '@/config/elastic';

@injectable()
export class DiscoveryService {

  async getPotentialMatches(data: GetPotentialMatchesRequest): Promise<GetPotentialMatchesResponse> {

    console.log('Received getPotentialMatches request:', data);

    // const result = await elastic.search({
    //   index: 'users',
    //   query: {
    //     bool: {
    //       must: [
    //         { match: { gender: preferences.gender } },
    //         {
    //           range: {
    //             age: {
    //               gte: preferences.ageRange[0],
    //               lte: preferences.ageRange[1],
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    // });

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
              distance: `${data.maxDistance * 1000}km`,
              'location.coordinates': [data.locationLng, data.locationLat],
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
            params: {
              lat: data.locationLat,
              lon: data.locationLng,
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
        distance: hit.fields.distance ? hit.fields.distance[0] / 1000 / 1000 : 0,
      };
    });

    console.log('Filtered Hits:', hits);

    return {
      matches: hits,
    };
  }
}
