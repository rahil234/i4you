import {
  CreateUserResponse,
  GetUserByEmailResponse,
  GetUserByIdResponse,
} from '@i4you/proto-files/user/v2';
import { User } from '@i4you/shared';

export interface IUserService {
  findUserById(id: string): Promise<GetUserByIdResponse>;
  findUserByEmail(email: string): Promise<GetUserByEmailResponse | null>;
  createUser(
    user: Required<Pick<User, 'name' | 'email' | 'password'>>
  ): Promise<CreateUserResponse>;
}
