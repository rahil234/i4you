import {
  GetUserByEmailResponse,
  UserServiceClient,
} from '@i4you/proto-files/user/v2';
import { Injectable } from '@nestjs/common';
import { GrpcClientProvider } from './grpc.client.provider.js';
import { IUserService } from './interfaces/IUserService';
import { User } from '@i4you/shared';

@Injectable()
export class GRPCUserService implements IUserService {
  private _userGrpcService: UserServiceClient;

  constructor(private readonly GrpcClientProvider: GrpcClientProvider) {
    this._userGrpcService = GrpcClientProvider.userClient;
  }

  async getUserById(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this._userGrpcService.getUserById({ id }, (err, response) => {
        if (err) return reject(err);
        resolve({
          ...response,
          role: 'member',
          joined: response.createdAt,
          status: response.status as User['status'],
          gender: response.gender as User['gender'],
          preferences: response.preferences as User['preferences'],
          location: response.location as User['location'],
        });
      });
    });
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    return new Promise((resolve, reject) => {
      this._userGrpcService.getUserByEmail({ email }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
}
