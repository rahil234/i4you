import { injectable } from 'inversify';
import { createUserClient } from 'proto-files/client/userClient';
import { env } from '@/config';

const { USER_GRPC_SERVER_URL } = env;

@injectable()
export class GrpcClientProvider {
  public readonly userClient = createUserClient(USER_GRPC_SERVER_URL);
}
