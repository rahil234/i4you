import { handleUnaryCall } from '@grpc/grpc-js';
import {
  GetUserByIdRequest,
  GetUserByIdResponse,
} from '@i4you/proto-files/generated/user/v2/user';

export default interface IUserGrpcService {
  getUser: handleUnaryCall<GetUserByIdRequest, GetUserByIdResponse>;
  handlers(): {
    getUser: handleUnaryCall<GetUserByIdRequest, GetUserByIdResponse>;
  };
}