import { Server, ServerCredentials } from '@grpc/grpc-js';

import { UserServiceService } from '@i4you/proto-files/user/v2';

import { env } from '@/config/env.config';
import { userGrpcService } from '@/services/grpc.user.service';

function startServer() {
  const { GRPC_PORT } = env;

  const server = new Server();
  server.addService(UserServiceService, new userGrpcService());
  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Server error:', err);
        return;
      }
      console.log(`User gRPC Server running at 0.0.0.0:${port}`);
    }
  );
}

startServer();
