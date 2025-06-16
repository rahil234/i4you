import { Server, ServerCredentials } from '@grpc/grpc-js';

import { UserServiceService } from '@i4you/proto-files/generated/user/v2/user';

import { env } from '@/config/env.config';
import { UserGrpcService } from '@/services/grpc.user.service';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';

const userService = container.get(TYPES.GrpcUserService) as UserGrpcService;

function startServer() {
  const { GRPC_PORT } = env;

  const server = new Server();
  server.addService(UserServiceService, userService.handlers());
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
