import IUserRepository from "@/repositories/interfaces/IUserRepository";
import {injectable, inject} from "inversify";
import {TYPES} from "@/types";
import UserDTO from "@/dtos/user.dtos";

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {
    }

    async getUserById(id: string) {
        return new UserDTO(await this.userRepository.findById(id));
    }
}
