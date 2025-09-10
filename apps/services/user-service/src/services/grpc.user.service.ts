import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserServiceServer,
} from '@i4you/proto-files/user/v2';
import { handleUnaryCall, UntypedHandleCall } from '@grpc/grpc-js';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { UserService } from '@/services/user.service';

const userService = container.get(TYPES.UserService) as UserService;

export class UserGrpcService implements UserServiceServer {
  [name: string]: UntypedHandleCall;

  getUserById: handleUnaryCall<GetUserByIdRequest, GetUserByIdResponse> =
    async (call, callback) => {
      try {
        const user = await userService.getUserById(call.request.id, 'member');

        if (!user) {
          callback({ code: 13, message: 'User not found' }, null);
          return;
        }

        const photos = await userService.getUserPhotos(user.id.toString());

        const userData = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
          age: user.age,
          bio: user.bio,
          photos,
          interests: user.interests || [],
          password: '',
          onboardingCompleted: user.onboardingCompleted,
          location: user.location,
          preferences: user.preferences,
          gender: user.gender,
          status: user.status,
        };

        callback(null, userData);
      } catch (err) {
        if (err instanceof Error)
          callback({ code: 13, message: err.message, stack: err.stack });
      }
    };

  getUserByEmail: handleUnaryCall<
    GetUserByEmailRequest,
    GetUserByEmailResponse
  > = async (call, callback) => {
    try {
      const user = await userService.getUserByEmail(call.request.email);

      if (!user) {
        callback({ code: 5, message: 'No User Exists' }, null);
        return;
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.joined,
        updatedAt: user.joined,
        age: user.age,
        bio: user.bio,
        photos: user.photos,
        interests: user.interests || [],
        password: '',
        onboardingCompleted: user.onboarding || true,
        preferences: user.preferences,
        gender: user.gender,
        status: user.status,
      };

      console.log('getUserByEmail response:', userData);

      callback(null, userData);
    } catch (err) {
      if (err instanceof Error)
        callback({ code: 13, message: err.message, stack: err.stack });
    }
  };

  createUser: handleUnaryCall<CreateUserRequest, CreateUserResponse> = async (
    call,
    callback
  ) => {
    try {
      const { name, email, password } = call.request;

      if (!name || !email || !password) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: 'Name, email, and password are required',
        });
      }

      const user = await userService.createUser({ email, name, password });

      console.log('createUser response:', user);

      callback(null, {
        id: user.id,
        name: user.name,
        email: user.email,
        updatedAt: String(user.updatedAt),
        createdAt: String(user.createdAt),
        onboardingCompleted: user.onboardingCompleted || false,
        status: user.status,
      });
    } catch (err) {
      console.error('Error in createUser:', err);
      if (err instanceof Error && 'statusCode' in err) {
        if (err.statusCode === 409) {
          return callback({
            code: 6,
            message: 'User already exists with this email',
          });
        }

        callback({
          code: 13,
          message: err.message || 'Internal server error',
        });
      }
    }
  };

  updateUser: handleUnaryCall<UpdateUserRequest, UpdateUserResponse> =
    async () => {};
}
