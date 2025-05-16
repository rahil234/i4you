import { injectable, inject } from 'inversify';
import {
  GetUserByEmailResponse,
  GetUserByIdResponse,
} from 'proto-files/generated/user/v2/user';
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

  async findUserById(id: string): Promise<GetUserByIdResponse> {
    console.log('Finding user by ID:', id);
    return new Promise((resolve, reject) => {
      this.userServiceClient.getUserById(
        { id },
        (err: any, response: GetUserByIdResponse) => {
          if (err) return reject(err);
          resolve(response);
        }
      );
    });
  }

  async findUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    console.log('Finding user by Email:', email);
    return new Promise((resolve, reject) => {
      this.userServiceClient.getUserByEmail(
        { email },
        (err: any, response: GetUserByEmailResponse) => {
          if (err) return reject(err);
          resolve(response);
        }
      );
    });
  }
}
