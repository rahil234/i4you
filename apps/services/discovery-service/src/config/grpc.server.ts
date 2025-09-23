import { Server, ServerCredentials } from '@grpc/grpc-js';

import { DiscoverServiceService } from '@i4you/proto-files/discovery/v2';

import { env } from '@/config/env.config';
import { discoverGrpcService } from '@/services/grpc.discovery.service';

export function startServer() {
  const { GRPC_PORT } = env;

  const server = new Server();
  server.addService(DiscoverServiceService, new discoverGrpcService());
  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Server error:', err);
        return;
      }
      console.log(`Discovery gRPC Server running at 0.0.0.0:${port}`);
    },
  );
}
