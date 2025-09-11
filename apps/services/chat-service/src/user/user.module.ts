import { Module } from '@nestjs/common';
import { GRPCUserService } from './user.grpc.service.js';
import { GrpcClientProvider } from './grpc.client.provider.js';

@Module({
  providers: [GRPCUserService, GrpcClientProvider],
  exports: [GRPCUserService, GrpcClientProvider],
})
export class UserModule {}
