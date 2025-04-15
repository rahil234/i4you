import { handleUnaryCall } from '@grpc/grpc-js';
import { GetUserRequest, GetUserResponse, UserServiceHandlers } from 'proto-files/server/userServer';
import { UserService } from '@/services/user.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';

@injectable()
export class UserGrpcService {

  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  getUser: handleUnaryCall<GetUserRequest, GetUserResponse> = async (
    call,
    callback,
  ) => {
    try {
      console.log('Received request to get user with ID:', call.request.id);
      const user = await this.userService.getUserById(call.request.id);

      if (!user) {
        callback({
          code: 13,
          message: 'User not found',
        } as any, null);
        return;
      }

      // noinspection Annotator
      const response: GetUserResponse = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      callback(null, response);
    } catch (error: any) {
      callback({
        code: 13,
        message: error,
        stack: error.stack,
      } as any, null);
    }
  };

  handlers(): UserServiceHandlers {
    return {
      getUser: this.getUser,
    };
  }
}