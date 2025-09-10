import { type LoginRequestDTO, LoginResponseDTO } from '@/dtos/login.dto';
import { RegisterRequestDTO } from '@/dtos/register.dto';

export interface IAuthService {
  login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO>;

  changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void>;

  adminLogin(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO>;

  register(registerDTO: RegisterRequestDTO): Promise<void>;

  forgetPassword(email: string): Promise<void>;

  resetPassword(password: string, token: string): Promise<void>;

  verifyAccount(password: string, token: string): Promise<void>;

  googleRegister(token: string): Promise<void>;

  googleLogin(token: string): Promise<LoginResponseDTO>;

  facebookRegister(token: string): Promise<LoginResponseDTO>;

  facebookLogin(token: string): Promise<LoginResponseDTO>;

  refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }>;

  logout(userId: string, token: string): Promise<void>;
}
