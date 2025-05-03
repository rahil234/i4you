import { injectable, inject } from 'inversify';
import { GetUserResponse } from 'proto-files/generated/user/v1/user.js';
import { TYPES } from '@/types';
import { GrpcClientProvider } from '@/providers/grpc.client.provider';

@injectable()
export class UserGrpcService {
  private userServiceClient;

  constructor(
    @inject(TYPES.GrpcClientProvider) grpcClientProvider: GrpcClientProvider
  ) {
    this.userServiceClient = grpcClientProvider.userClient;
  }

  async findUserById(id: string): Promise<GetUserResponse> {
    console.log('Finding user by ID:', id);
    return new Promise((resolve, reject) => {
      this.userServiceClient.getUser({ id }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }

  // async findUserByEmail(email: string) {
  //   return new Promise((resolve, reject) => {
  //     this.userServiceClient.getUser({ id: '' }, (err, response) => {
  //       if (err) return reject(err);
  //       resolve(response);
  //     });
  //   });
  // }
}
