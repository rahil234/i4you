import {
  GetUserByEmailResponse,
  GetUserByIdResponse,
  UserServiceClient,
} from '@i4you/proto-files/user/v2';
import { Inject, Injectable } from '@nestjs/common';
import { GrpcClientProvider } from './grpc.client.provider.js';

@Injectable()
export class UserGrpcService {
  private userGrpcService: UserServiceClient;

  constructor(@Inject() GrpcClientProvider: GrpcClientProvider) {
    this.userGrpcService = GrpcClientProvider.userClient;
  }

  async getUserById(id: string): Promise<GetUserByIdResponse> {
    return new Promise((resolve, reject) => {
      this.userGrpcService.getUserById({ id }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    return new Promise((resolve, reject) => {
      this.userGrpcService.getUserByEmail({ email }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
}
