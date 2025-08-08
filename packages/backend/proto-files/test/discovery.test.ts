import { test, beforeAll } from 'vitest';
import { credentials, handleUnaryCall, Server, ServerCredentials, UntypedHandleCall } from '@grpc/grpc-js';
import {
  DiscoverServiceService,
  DiscoverServiceServer,
  DiscoverServiceClient,
  GetPotentialMatchesRequest, GetPotentialMatchesResponse,
} from '../generated/discovery/v1/discovery';

let server: Server;

class DiscoverService implements DiscoverServiceServer {
  [name: string]: UntypedHandleCall;

  getPotentialMatches: handleUnaryCall<
    GetPotentialMatchesRequest,
    GetPotentialMatchesResponse
  > = (call, callback) => {

    console.log('Received request to get matches ', 'with\n', call.request);

    callback(null, {
      matches: [],
    });
  };
}

beforeAll(async () => {
  server = new Server();

  server.addService(DiscoverServiceService, new DiscoverService());

  await new Promise<void>((resolve, reject) => {
    server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        console.error('Failed to bind:', err);
        reject(err);
      } else {
        console.log(`Server running on port ${port}`);
        resolve();
      }
    });
  });
});

test('gRPC user-service responds correctly', async () => {
  const client = new DiscoverServiceClient('localhost:50051', credentials.createInsecure());

  await new Promise<void>((resolve, reject) => {
    client.getPotentialMatches({
      showMe: 'female',
      maxDistance: 100,
      lookingFor: 'casual',
      maxAge: 99,
      minAge: 18,
      locationLat: 0,
      locationLng: 0,
    }, (err, res) => {
      if (err) return reject(err);
      console.log('Response from gRPC:', res);
      resolve();
    });
  });
});
