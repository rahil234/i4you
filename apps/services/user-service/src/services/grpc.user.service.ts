import { inject, injectable } from 'inversify';
import { handleUnaryCall } from '@grpc/grpc-js';
import {
  GetUserByIdRequest,
  GetUserByIdResponse,
} from '@i4you/proto-files/generated/user/v2/user';
import { UserService } from '@/services/user.service';
import { TYPES } from '@/types';
import IUserGrpcService from '@/services/interfaces/IUserGrpcService';

@injectable()
export class UserGrpcService implements IUserGrpcService{
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  getUser: handleUnaryCall<GetUserByIdRequest, GetUserByIdResponse> = async (
    call,
    callback
  ) => {
    try {
      console.log('Received request to get user with ID:', call.request.id);
      const user = await this.userService.getUserById(
        call.request.id,
        'member'
      );

      if (!user) {
        callback(
          {
            code: 13,
            message: 'User not found',
          } as any,
          null
        );
        return;
      }

      const userResponse: GetUserByIdResponse = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone: 'NO PHONE',
        address: 'No Address',
        createdAt: user.joined,
        updatedAt: user.joined, //needs fix
      };

      callback(null, userResponse);
    } catch (error: any) {
      callback(
        {
          code: 13,
          message: error,
          stack: error.stack,
        } as any,
        null
      );
    }
  };

  handlers() {
    return {
      getUser: this.getUser,
    };
  }
}
