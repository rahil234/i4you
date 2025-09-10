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
import {
  PasswordResetTemplate,
  verificationEmailTemplate,
} from '@/utils/mail-templates';
import { NotFoundError } from '@/errors/NotFoundError';
import { env } from '@/config';
import { createError } from '@i4you/http-errors';
import ICacheService from '@/services/interfaces/ICacheService';
import { IMailService } from '@/services/interfaces/IMailService';
import { IAuthService } from '@/services/interfaces/IAuthService';
import { IUserService } from '@/services/interfaces/IUserService';

const APP_URL = env.APP_URL;

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository,
    @inject(TYPES.CacheService) private _cacheService: ICacheService,
    @inject(TYPES.UserGrpcService) private _userService: IUserService,
    @inject(TYPES.MailService) private _mailService: IMailService
  ) {}

  private async _blacklistAccessToken(token: string) {
    await this._cacheService.set(`blacklist:${token}`, 'true', 60 * 20);
  }

  private async _addRefreshToken(userId: string, token: string) {
    await this._cacheService.set(`refresh:${userId}`, token, 60 * 60 * 24 * 7);
  }

  private async _removeRefreshToken(userId: string) {
    await this._cacheService.del(`refresh:${userId}`);
  }

  async login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this._userRepository.findByEmail(loginDTO.email);
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

    await this._addRefreshToken(user._id, refreshToken);

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
    const user = (await this._userRepository.find({ _id: id }))[0];

    if (!user) {
      throw new ValidationError('User not found');
    }

    if (!(await comparePassword(currentPassword, user.password))) {
      throw new ValidationError('Invalid credentials');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this._userRepository.update(id, { password: hashedPassword });
  }

  async adminLogin(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this._adminRepository.findByEmail(loginDTO.email);
    if (!user || !(await comparePassword(loginDTO.password, user.password))) {
      throw new ValidationError('Invalid credentials');
    }

    const accessToken = generateAccessToken({
      sub: user._id,
      role: 'admin',
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ sub: user._id, role: 'admin' });

    await this._addRefreshToken(user._id, refreshToken);

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  }

  async register(registerDTO: RegisterRequestDTO): Promise<void> {
    const { name, email, password } = registerDTO;

    if (!name || !email || !password) {
      throw new ValidationError('All fields are required');
    }

    const hashedPassword = await hashPassword(password);

    try {
      const user = await this._userService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      console.log('User created:', user);

      const token = generateEmailVerificationToken({
        sub: user.id,
        email: user.email,
      });

      const verificationLink = `${APP_URL}/verify?token=${token}`;

      await this._mailService.sendMail({
        to: user.email,
        subject: 'Verify your i4you account',
        html: verificationEmailTemplate(user.name, verificationLink),
      });
    } catch (err) {
      if (err instanceof UserExistsError) {
        throw new UserExistsError(
          'User already exists with this email. Please login.'
        );
      }
      if (err instanceof ValidationError) {
        throw err;
      }
      console.error('Registration failed:', err);
      throw new Error('Registration failed. Please try again later.');
    }
  }

  async forgetPassword(email: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const resetToken = generateResetToken({ sub: user.id });

    const APP_URL = env.APP_URL;

    const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;

    await this._mailService.sendMail({
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

    const user = await this._userService.findUserById(userId);

    if (!user) {
      throw new ValidationError('User not found');
    }

    const hashedPassword = await hashPassword(password);

    await this._userRepository.update(userId, { password: hashedPassword });
  }

  async verifyAccount(password: string, token: string) {
    const { sub: userId } = verifyRefreshToken(token);

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const user = await this._userRepository.findById(userId);

    if (!user || !(await comparePassword(password, user.password))) {
      throw new ValidationError('Invalid credentials');
    }

    if (!user) {
      throw new ValidationError('User not found');
    }

    await this._userRepository.update(userId, { isVerified: true });
  }

  async googleRegister(token: string): Promise<void> {
    const googleUser = await fetchGoogleUser(token);
    if (!googleUser) {
      throw createError.BadRequest('Invalid credentials');
    }

    const user = await this._userRepository.findByEmail(googleUser.email);

    if (user) {
      throw createError.Conflict(
        'User already exists with this email. Please login.'
      );
    }

    const hashedPassword = await hashPassword(googleUser.email);

    const newUser = await this._userRepository.create({
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

    const user = await this._userRepository.findByEmail(googleUser.email);

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

    await this._addRefreshToken(user._id, refreshToken);

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
      console.log('Invalid token:', token);
      throw new Error('Invalid token');
    }

    const storedToken = await this._cacheService.get(`refresh:${userId}`);

    if (!storedToken || storedToken !== token) {
      console.log('Stored token not found or does not match:', storedToken);
      throw createError.Unauthorized('Invalid refresh token');
    }

    const user =
      role === 'admin'
        ? await this._adminRepository.findById(userId)
        : await this._userService.findUserById(userId);

    if (!user) throw new Error('User not found');
    if (user.status === 'suspended') throw new SuspendedUserError();

    const accessToken = generateAccessToken({
      sub: user.id,
      role,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken({ sub: user.id, role });

    await this._cacheService.set(
      `refresh:${user.id}`,
      newRefreshToken,
      60 * 60 * 24 * 7
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, token: string): Promise<void> {
    if (!token || !userId) {
      throw new ValidationError('Token is required');
    }

    await this._blacklistAccessToken(token);
    await this._removeRefreshToken(userId);
  }
}
