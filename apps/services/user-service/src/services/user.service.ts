import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import UserDTO from '@/dtos/user.dtos';

@injectable()
export class UserService {
  private userRepository;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string) {
    return new UserDTO(await this.userRepository.findById(id));
  }
}
