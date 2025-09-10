import { Server, ServerCredentials } from '@grpc/grpc-js';

import { InteractionServiceService } from '@i4you/proto-files/interaction/v1';

import { env } from '@/config/env.config';
import { InteractionGrpcService } from '@/services/interaction.grpc.service';

export function startGrpcServer() {
  const { GRPC_PORT } = env;

  const server = new Server();
  server.addService(InteractionServiceService, new InteractionGrpcService());
  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Server error:', err);
        return;
      }
      console.log(`Interaction gRPC Server running at 0.0.0.0:${port}`);
    }
  );
}
