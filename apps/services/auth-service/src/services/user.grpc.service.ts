import { injectable, inject } from 'inversify';
import {
  CreateUserResponse,
  GetUserByEmailResponse,
  GetUserByIdResponse,
} from '@i4you/proto-files/user/v2';
import { TYPES } from '@/types';
import { GrpcClientProvider } from '@/providers/grpc.client.provider';
import { User } from '@i4you/shared';

@injectable()
export class UserGrpcService {
  constructor(
    @inject(TYPES.GrpcClientProvider) private client: GrpcClientProvider
  ) {}

  async findUserById(id: string): Promise<GetUserByIdResponse> {
    console.log('Finding user by ID:', id);
    return new Promise((resolve, reject) => {
      this.client.getUserById({ id }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }

  async findUserByEmail(email: string): Promise<GetUserByEmailResponse | null> {
    console.log('Finding user by Email:', email);
    return new Promise((resolve, reject) => {
      this.client.getUserByEmail({ email }, (err, response) => {
        if (err) {
          if (err.code === 5) {
            return resolve(null);
          }
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  async createUser(
    user: Required<Pick<User, 'name' | 'email' | 'password'>>
  ): Promise<CreateUserResponse> {
    return new Promise((resolve, reject) => {
      this.client.createUser(user, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
}
