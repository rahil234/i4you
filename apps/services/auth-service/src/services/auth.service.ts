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
import { ICacheService } from '@/services/interfaces/ICacheService';
import { IMailService } from '@/services/interfaces/IMailService';
import { IAuthService } from '@/services/interfaces/IAuthService';
import { IUserService } from '@/services/interfaces/IUserService';
import { CONSTANTS } from '@/constants/constants';

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
    await this._cacheService.set(
      `${CONSTANTS.TOKEN.ACCESS_BLACKLIST_PREFIX}${token}`,
      'true',
      CONSTANTS.TOKEN.ACCESS_BLACKLIST_TTL
    );
  }

  private async _addRefreshToken(userId: string, token: string) {
    await this._cacheService.set(
      `${CONSTANTS.TOKEN.REFRESH_PREFIX}${userId}`,
      token,
      CONSTANTS.TOKEN.REFRESH_TTL
    );
  }

  private async _removeRefreshToken(userId: string) {
    await this._cacheService.del(`${CONSTANTS.TOKEN.REFRESH_PREFIX}${userId}`);
  }

  async login(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this._userRepository.findByEmail(loginDTO.email);
    if (!user || !(await comparePassword(loginDTO.password, user.password))) {
      throw new ValidationError(CONSTANTS.ERRORS.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new ValidationError(CONSTANTS.ERRORS.VERIFY_EMAIL);
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
      throw new ValidationError(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    if (!(await comparePassword(currentPassword, user.password))) {
      throw new ValidationError(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
    }

    const hashedPassword = await hashPassword(newPassword);
    await this._userRepository.update(id, { password: hashedPassword });
  }

  async adminLogin(loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this._adminRepository.findByEmail(loginDTO.email);
    if (!user || !(await comparePassword(loginDTO.password, user.password))) {
      throw new ValidationError(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
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
      throw new ValidationError(CONSTANTS.ERRORS.ALL_FIELDS_REQUIRED);
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

      const verificationLink = `${APP_URL}${CONSTANTS.ROUTES.VERIFY_PATH}${token}`;

      await this._mailService.sendMail({
        to: user.email,
        subject: CONSTANTS.ERRORS.VERIFY_ACCOUNT_SUBJECT,
        html: verificationEmailTemplate(user.name, verificationLink),
      });
    } catch (err) {
      if (err instanceof UserExistsError) {
        throw new UserExistsError(CONSTANTS.ERRORS.USER_EXISTS);
      }
      if (err instanceof ValidationError) {
        throw err;
      }
      console.error('Registration failed:', err);
      throw new Error(CONSTANTS.ERRORS.REGISTRATION_FAILED);
    }
  }

  async forgetPassword(email: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationError(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    const resetToken = generateResetToken({ sub: user.id });

    const resetLink = `${APP_URL}${CONSTANTS.ROUTES.RESET_PASSWORD_PATH}${resetToken}`;

    await this._mailService.sendMail({
      to: user.email,
      subject: CONSTANTS.ERRORS.RESET_PASSWORD_SUBJECT,
      html: PasswordResetTemplate(user.name, resetLink),
    });
  }

  async resetPassword(password: string, token: string) {
    const { sub: userId } = verifyRefreshToken(token);

    if (!userId) {
      throw new NotFoundError(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    const user = await this._userService.findUserById(userId);

    if (!user) {
      throw new ValidationError(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(password);

    await this._userRepository.update(userId, { password: hashedPassword });
  }

  async verifyAccount(password: string, token: string) {
    const { sub: userId } = verifyRefreshToken(token);

    if (!userId) {
      throw new NotFoundError(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    const user = await this._userRepository.findById(userId);

    if (!user || !(await comparePassword(password, user.password))) {
      throw new ValidationError(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
    }

    if (!user) {
      throw new ValidationError(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    await this._userRepository.update(userId, { isVerified: true });
  }

  async googleRegister(token: string): Promise<void> {
    const googleUser = await fetchGoogleUser(token);
    if (!googleUser) {
      throw createError.BadRequest(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
    }

    const user = await this._userRepository.findByEmail(googleUser.email);

    if (user) {
      throw createError.Conflict(CONSTANTS.ERRORS.USER_EXISTS);
    }

    const hashedPassword = await hashPassword(googleUser.email);

    const newUser = await this._userRepository.create({
      name: googleUser.given_name,
      email: googleUser.email,
      password: hashedPassword,
      isVerified: true,
    });

    if (!newUser) {
      throw createError.Internal(CONSTANTS.ERRORS.FAILED_CREATE_USER);
    }
  }

  async googleLogin(token: string): Promise<LoginResponseDTO> {
    const googleUser = await fetchGoogleUser(token);
    if (!googleUser) {
      throw new Error(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
    }

    const user = await this._userRepository.findByEmail(googleUser.email);

    if (!user) {
      throw createError.BadRequest(CONSTANTS.ERRORS.USER_NOT_FOUND);
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
      throw createError.BadRequest(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
    }

    console.log('Facebook user:', facebookUser);

    throw createError.NotImplemented(CONSTANTS.ERRORS.NOT_IMPLEMENTED);
  }

  async facebookLogin(token: string): Promise<LoginResponseDTO> {
    const facebookUser = await fetchFacebookUser(token);
    if (!facebookUser) {
      throw new Error(CONSTANTS.ERRORS.INVALID_CREDENTIALS_SIMPLE);
    }

    console.log('Facebook user:', facebookUser);

    throw new ValidationError(CONSTANTS.ERRORS.NOT_IMPLEMENTED);
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { sub: userId, role } = verifyRefreshToken(token);

    if (!userId) {
      console.log('Invalid token:', token);
      throw new Error(CONSTANTS.ERRORS.INVALID_TOKEN);
    }

    const storedToken = await this._cacheService.get(
      `${CONSTANTS.TOKEN.REFRESH_PREFIX}${userId}`
    );

    if (!storedToken || storedToken !== token) {
      console.log('Stored token not found or does not match:', storedToken);
      throw createError.Unauthorized(CONSTANTS.ERRORS.INVALID_REFRESH_TOKEN);
    }

    const user =
      role === 'admin'
        ? await this._adminRepository.findById(userId)
        : await this._userService.findUserById(userId);

    if (!user) throw new Error(CONSTANTS.ERRORS.USER_NOT_FOUND);
    if (user.status === 'suspended') throw new SuspendedUserError();

    const accessToken = generateAccessToken({
      sub: user.id,
      role,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken({ sub: user.id, role });

    await this._cacheService.set(
      `${CONSTANTS.TOKEN.REFRESH_PREFIX}${user.id}`,
      newRefreshToken,
      CONSTANTS.TOKEN.REFRESH_TTL
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, token: string): Promise<void> {
    if (!token || !userId) {
      throw new ValidationError(CONSTANTS.ERRORS.TOKEN_REQUIRED);
    }

    await this._blacklistAccessToken(token);
    await this._removeRefreshToken(userId);
  }
}
