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
import { RegisterRequestDTO } from '@/dtos/register.dto';
import { TYPES } from '@/types';
import { fetchGoogleUser } from '@/utils/google-auth';
import { fetchFacebookUser } from '@/utils/facebook-auth';
import { UserExistsError } from '@/errors/UserExistsError';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { SuspendedUserError } from '@/errors/SuspendedUserError';
import { ValidationError } from '@/errors/ValidationError';
import { MailService } from '@/services/mail.service';
import { PasswordResetTemplate } from '@/utils/mail-templates';
import { NotFoundError } from '@/errors/NotFoundError';
import { env } from '@/config';
import { createError } from '@i4you/http-errors';

const APP_URL = env.APP_URL;

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

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = (await this.userRepository.find({ _id: id }))[0];

    if (!user) {
      throw new ValidationError('User not found');
    }

    if (!(await comparePassword(currentPassword, user.password))) {
      throw new ValidationError('Invalid credentials');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.update(id, { password: hashedPassword });
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

  async register(registerDTO: RegisterRequestDTO): Promise<void> {
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

    const verificationLink = `${APP_URL}/verify?token=${verificationToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify your i4you account',
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Thank you for registering on i4you!</p>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}" 
        style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;"
        >
        Verify Email
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async forgetPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const resetToken = generateResetToken({ sub: user.id });

    const APP_URL = env.APP_URL;

    const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;

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

  async googleRegister(token: string): Promise<void> {
    const googleUser = await fetchGoogleUser(token);
    if (!googleUser) {
      throw createError.BadRequest('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(googleUser.email);

    if (user) {
      throw createError.Conflict(
        'User already exists with this email. Please login.'
      );
    }

    const hashedPassword = await hashPassword(googleUser.email);

    const newUser = await this.userRepository.create({
      name: googleUser.given_name,
      email: googleUser.email,
      password: hashedPassword,
      isVerified: true,
    });

    if (!newUser) {
      throw createError.Internal('Failed to create user. try again later.');
    }
  }

  async googleLogin(token: string): Promise<LoginResponseDTO> {
    const googleUser = await fetchGoogleUser(token);
    if (!googleUser) {
      throw new Error('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(googleUser.email);

    if (!user) {
      throw createError.BadRequest('User not found. Please register first.');
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

  async facebookRegister(token: string): Promise<LoginResponseDTO> {
    const facebookUser = await fetchFacebookUser(token);

    if (!facebookUser) {
      throw createError.BadRequest('Invalid User');
    }

    console.log('Facebook user:', facebookUser);

    throw createError.NotImplemented('NOT IMPLEMENTED');
  }

  async facebookLogin(token: string): Promise<LoginResponseDTO> {
    const facebookUser = await fetchFacebookUser(token);
    if (!facebookUser) {
      throw new Error('Invalid credentials');
    }

    console.log('Facebook user:', facebookUser);

    throw new ValidationError('NOT IMPLEMENTED');
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    console.log('new Access Token: ', accessToken);

    const refreshToken = generateRefreshToken({
      sub: user._id,
      role,
    });

    return { accessToken, refreshToken };
  }
}
