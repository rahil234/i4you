import { UserServiceServer } from '@i4you/proto-files/user/v2';
import { UserService } from '@/services/user.service';

export function createUserGrpcService(
  userService: UserService
): UserServiceServer {
  return {
    getUserById: async (call, callback) => {
      try {
        const user = await userService.getUserById(call.request.id, 'member');

        if (!user) {
          return callback({ code: 13, message: 'User not found' });
        }

        const photos = await userService.getUserPhotos(user.id.toString());

        callback(null, {
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
        });
      } catch (err) {
        callback({
          code: 13,
          message: err instanceof Error ? err.message : 'Internal error',
        });
      }
    },

    getUserByEmail: async (call, callback) => {
      try {
        const user = await userService.getUserByEmail(call.request.email);

        if (!user) {
          return callback({ code: 5, message: 'No User Exists' });
        }

        callback(null, {
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
        });
      } catch (err) {
        callback({
          code: 13,
          message: err instanceof Error ? err.message : 'Internal error',
        });
      }
    },

    createUser: async (call, callback) => {
      try {
        const { name, email, password } = call.request;

        if (!name || !email || !password) {
          return callback({
            code: 3,
            message: 'Name, email, and password are required',
          });
        }

        const user = await userService.createUser({
          email,
          name,
          password,
        });

        callback(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          updatedAt: String(user.updatedAt),
          createdAt: String(user.createdAt),
          onboardingCompleted: user.onboardingCompleted || false,
          status: user.status,
        });
      } catch (err: any) {
        if (err?.statusCode === 409) {
          return callback({
            code: 6,
            message: 'User already exists with this email',
          });
        }

        callback({
          code: 13,
          message: err?.message || 'Internal server error',
        });
      }
    },

    updateUser: async (_call, callback) => {
      callback({
        code: 13,
        message: 'Not Implemented',
      });
    },
  };
}
