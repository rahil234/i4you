import { GetUserByIdResponse } from '@i4you/proto-files/user/v2';

export interface IUserService {
  findUserById(id: string): Promise<GetUserByIdResponse>;
}
