import { UserServiceClient } from 'generated/user/v2/user';
import { credentials } from '@grpc/grpc-js';

export const createUserClient = (url: string) => {
  return new UserServiceClient(url, credentials.createInsecure());
};
