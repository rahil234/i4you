import { createUserClient } from 'proto-files/client/userClient';
import { env } from '@/config';

const { USER_GRPC_SERVER_URL } = env;

export const userClient = createUserClient(USER_GRPC_SERVER_URL);
