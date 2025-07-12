import { Module } from '@nestjs/common';
import { UserGrpcService } from './user.grpc.service';
import { GrpcClientProvider } from './grpc.client.provider';

@Module({
  providers: [UserGrpcService, GrpcClientProvider],
  exports: [UserGrpcService],
})
export class UserModule {}
