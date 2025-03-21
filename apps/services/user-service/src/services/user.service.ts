import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import IUserRepository from "../core/interface/repositories/IUserRepository";

export class UserService {
    constructor(private userRepository: IUserRepository) {}

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !await comparePassword(password, user.password)) {
            throw new Error('Invalid credentials');
        }
        return generateToken({ id: user._id, email: user.email });
    }

    async register(email: string, password: string) {
        const hashedPassword = await hashPassword(password);
        const user = await this.userRepository.create({
            email,
            password: hashedPassword
        });
        return generateToken({ id: user._id, email: user.email });
    }
}
