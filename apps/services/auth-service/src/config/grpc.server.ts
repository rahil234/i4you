import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { UserRequest, UserResponse } from '@/proto/user';
import { GrpcObject } from '@grpc/grpc-js/build/src/make-client';
import { container } from '@/config/inversify.config';
import { env } from '@/config';
import { AuthService } from '@/services/auth.service';
import { TYPES } from '@/types';

const GRPC_PORT = env.GRPC_PORT;

const PROTO_PATH = require.resolve('@repo/proto-files/user/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

type ImplementationType = {
  GetUser: grpc.ServerUnaryCall<UserRequest, UserResponse>;
};

const userProto = grpc.loadPackageDefinition(
  packageDefinition
) as GrpcObject & {
  user: {
    UserService: {
      service: grpc.ServiceDefinition<ImplementationType>;
    };
  };
};

const server = new grpc.Server();

const authService = container.get<AuthService>(TYPES.AuthService);

server.addService(userProto.user.UserService.service, {
  GetUser: authService.getUser,
});

server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('User Service running on port ', GRPC_PORT);
  }
);
