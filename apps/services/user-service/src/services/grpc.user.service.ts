import { UserServiceServer } from '@i4you/proto-files/generated/user/v2/user';
import { UserService } from '@/services/user.service';

export const userGrpcService = (
  userService: UserService
): UserServiceServer => ({
  getUserById: async (call, callback) => {
    try {
      const user = await userService.getUserById(call.request.id, 'member');
      if (!user) {
        callback({ code: 13, message: 'User not found' } as any, null);
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

      // console.log('getUserByEmail response:', userData);

      callback(null, {
        user: userData,
      });
    } catch (err: any) {
      callback(
        { code: 13, message: err.message, stack: err.stack } as any,
        null
      );
    }
  },

  getUserByEmail: async (call, callback) => {
    try {
      const user = await userService.getUserById(call.request.email, 'member');
      if (!user) {
        callback({ code: 13, message: 'User not found' } as any, null);
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

      callback(null, {
        user: userData,
      });
    } catch (err: any) {
      callback(
        { code: 13, message: err.message, stack: err.stack } as any,
        null
      );
    }
  },
});
