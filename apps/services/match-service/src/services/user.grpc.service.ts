import { injectable, inject } from 'inversify';
import { GetUserByIdResponse } from '@i4you/proto-files/user/v2';
import { TYPES } from '@/types';
import { UserGrpcProvider } from '@/providers/user.grpc.provider';

@injectable()
export class UserGrpcService {
  constructor(
    @inject(TYPES.UserGrpcProvider) private userServiceClient: UserGrpcProvider
  ) {}

  async findUserById(id: string): Promise<GetUserByIdResponse> {
    return new Promise((resolve, reject) => {
      this.userServiceClient.getUserById({ id }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
}
