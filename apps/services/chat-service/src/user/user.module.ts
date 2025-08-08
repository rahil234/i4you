import { Module } from '@nestjs/common';
import { UserGrpcService } from './user.grpc.service.js';
import { GrpcClientProvider } from './grpc.client.provider.js';

@Module({
  providers: [UserGrpcService, GrpcClientProvider],
  exports: [UserGrpcService],
})
export class UserModule {}
