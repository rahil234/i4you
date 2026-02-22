import { injectable } from 'inversify';
import { UserServiceClient } from '@i4you/proto-files/user/v2';

import { env } from '@/config';
import { credentials } from '@grpc/grpc-js';

const { USER_GRPC_SERVER_URL } = env;

@injectable()
export class GrpcClientProvider extends UserServiceClient {
  constructor() {
    super(USER_GRPC_SERVER_URL, credentials.createInsecure());
  }
}
