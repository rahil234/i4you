import { injectable, inject } from 'inversify';
import { hashPassword, comparePassword } from '@/utils/bcrypt';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import IAuthRepository from '@/repositories/interfaces/IAuthRepository';
import { type LoginRequestDTO, LoginResponseDTO } from '@/dtos/login.dto';
import type { RegisterRequestDTO } from '@/dtos/register.dto';
import { TYPES } from '@/types';
import fetchGoogleUser from '@/utils/google-auth';
import { getUserById } from '@/grpc/user.client.helpers';

export class BadRequestError extends Error {
  status = 400;

  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

@injectable()
export class AuthService {
  private authRepository;

  constructor(@inject(TYPES.AuthRepository) authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    // if (!loginDTO.isValid()) {
    //     throw new Error("Invalid login data");
    // }

    const user = await this.authRepository.findByEmail(loginDTO.email);
    if (!user || !(await comparePassword(loginDTO.password, user.password))) {
      throw new BadRequestError('Invalid credentials');
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ sub: user._id });

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  }

  async googleLogin(token: string): Promise<LoginResponseDTO> {
    // fetch the user details from the Google api
    const userDe = await fetchGoogleUser(token);
    if (!userDe) {
      throw new Error('Invalid credentials');
    }

    console.log(`Google user details: ${JSON.stringify(userDe)}`);

    let user = await this.authRepository.findByEmail(userDe.email);

    if (!user) {
      user = await this.authRepository.create({
        name: userDe.name,
        email: userDe.email,
        password: '',
      });
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ sub: user._id });

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  }

  async register(registerDTO: RegisterRequestDTO): Promise<LoginResponseDTO> {
    console.log(
      `Registering user \nname: ${registerDTO.name}, email: ${registerDTO.email}, password: ${registerDTO.password}`
    );

    const hashedPassword = await hashPassword(registerDTO.password);

    const user = await this.authRepository.create({
      name: registerDTO.name,
      email: registerDTO.email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({
      sub: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ sub: user._id });

    return new LoginResponseDTO(accessToken, refreshToken, {
      ...user,
      id: user._id,
    });
  }

  async refreshToken(userId: string): Promise<LoginResponseDTO> {
    const user = await getUserById(userId);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    console.log('User:', user);

    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({ sub: user.id });

    return new LoginResponseDTO(accessToken, refreshToken, {
      ...user,
      id: user.id,
    });
  }

  async logout(_userId: string): Promise<void> {
    // await this.authRepository.logout(userId);
  }
}
