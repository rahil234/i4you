import { Server, ServerCredentials } from '@grpc/grpc-js';

import { TYPES } from '@/types';
import { env } from '@/config/env.config';
import { UserService } from '@/services/user.service';
import { container } from '@/config/inversify.config';
import { UserServiceService } from '@i4you/proto-files/user/v2';
import { createUserGrpcService } from '@/services/grpc.user.service';

function startServer() {
  const { GRPC_PORT } = env;

  const userService = container.get<UserService>(TYPES.UserService);

  const server = new Server();
  server.addService(UserServiceService, createUserGrpcService(userService));
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
