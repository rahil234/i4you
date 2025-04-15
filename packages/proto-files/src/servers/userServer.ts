import { handleUnaryCall, ServerUnaryCall, sendUnaryData, UntypedServiceImplementation } from '@grpc/grpc-js';
import {
  UserServiceService,
  UserServiceServer as US,
  GetUserRequest,
  GetUserResponse,
} from 'generated/user/v1/user';

export interface UserServiceHandlers extends UntypedServiceImplementation {

}

export { UserServiceService, GetUserRequest, GetUserResponse };
