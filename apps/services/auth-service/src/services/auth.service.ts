import { injectable, inject } from 'inversify';
import { hashPassword, comparePassword } from '@/utils/bcrypt';
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { type LoginRequestDTO, LoginResponseDTO } from '@/dtos/login.dto';
import type { RegisterRequestDTO } from '@/dtos/register.dto';
import { TYPES } from '@/types';
import { fetchGoogleUser } from '@/utils/google-auth';
import { UserExistsError } from '@/errors/UserExistsError';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { SuspendedUserError } from '@/errors/SuspendedUserError';
import { ValidationError } from '@/errors/ValidationError';
import { MailService } from '@/services/mail.service';
import { PasswordResetTemplate } from '@/utils/mail-templates';
import { NotFoundError } from '@/errors/NotFoundError';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository,
    @inject(TYPES.MailService) private mailService: MailService
  ) {}

  async login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(loginDTO.email);
    if (!user || !(await comparePassword(loginDTO.password, user.password))) {
      throw new ValidationError(
        'Invalid credentials. please check your email or password'
      );
    }

    if (!user.isVerified) {
      throw new ValidationError('Please verify your email address');
    }

    if (user.status === 'suspended') {
      throw new SuspendedUserError();
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      role: 'member',
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      sub: user._id,
      role: 'member',
    });

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  }

  async adminLogin(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.adminRepository.findByEmail(loginDTO.email);
    if (!user || !(await comparePassword(loginDTO.password, user.password))) {
      throw new ValidationError('Invalid credentials');
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      role: 'admin',
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ sub: user._id, role: 'admin' });

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

    const existingUser = await this.userRepository.findByEmail(
      registerDTO.email
    );

    if (existingUser) {
      throw new UserExistsError();
    }

    const user = await this.userRepository.create({
      name: registerDTO.name,
      email: registerDTO.email,
      password: hashedPassword,
      isVerified: false,
    });

    const verificationToken = generateEmailVerificationToken({
      sub: user._id,
      email: user.email,
    });

    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify your i4you account',
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Thank you for registering on i4you!</p>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    const accessToken = generateAccessToken({
      sub: user._id,
      role: 'member',
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      sub: user._id,
      role: 'member',
    });

    return new LoginResponseDTO(accessToken, refreshToken, {
      ...user,
      id: user._id,
    });
  }

  async forgetPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const resetToken = generateResetToken({ sub: user.id });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Reset Your Password',
      html: PasswordResetTemplate(user.name, resetLink),
    });
  }

  async resetPassword(password: string, token: string) {
    const { sub: userId } = verifyRefreshToken(token);

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ValidationError('User not found');
    }

    const hashedPassword = await hashPassword(password);

    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async verifyAccount(password: string, token: string) {
    const { sub: userId } = verifyRefreshToken(token);

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const user = await this.userRepository.findById(userId);

    if (!user || !(await comparePassword(password, user.password))) {
      throw new ValidationError('Invalid credentials');
    }

    if (!user) {
      throw new ValidationError('User not found');
    }

    await this.userRepository.update(userId, { isVerified: true });
  }

  async googleLogin(token: string): Promise<LoginResponseDTO> {
    const googleUser = await fetchGoogleUser(token);
    if (!googleUser) {
      throw new Error('Invalid credentials');
    }

    let user = await this.userRepository.findByEmail(googleUser.email);

    if (!user) {
      const newUser = await this.userRepository.create({
        name: googleUser.given_name,
        email: googleUser.email,
        password: '123456789', // default password
      });
      console.log('New user created', newUser);
      user = newUser;
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      role: 'member',
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      sub: user._id,
      role: 'member',
    });

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  }

  async refreshToken(token: string): Promise<LoginResponseDTO> {
    const { sub: userId, role } = verifyRefreshToken(token);

    if (!userId) {
      throw new Error('Invalid token');
    }

    let user;
    if (role === 'admin') {
      user = await this.adminRepository.findById(userId);
    } else {
      user = await this.userRepository.findById(userId);
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (user.status === 'suspended') {
      throw new SuspendedUserError();
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      role,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      sub: user._id,
      role,
    });

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  }
}
