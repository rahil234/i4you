import { userClient } from '@/grpc/user.client';
import { User } from '@repo/shared';

export function getUserById(id: string): Promise<User> {
  return new Promise((resolve, reject) => {
    userClient.getUser({ id }, (err: any, res: any) => {
      if (err) {
        console.log('Error getting user:', err);
        reject(err);
      } else resolve(res);
    });
  });
}
