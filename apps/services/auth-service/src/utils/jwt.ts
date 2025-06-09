import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '@/config';
import { UserJwtPayload } from '@i4you/shared';

/**
 * Generates an access token
 * @param payload Data to encode in the token
 * @returns Signed JWT access token
 */
export const generateAccessToken = (payload: UserJwtPayload) => {
  try {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  } catch (error) {
    throw new Error(
      `Access token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Generates a refresh-token token
 * @param payload Data to encode in the token
 * @returns Signed JWT refresh-token token
 */
export const generateRefreshToken = (
  payload: Pick<UserJwtPayload, 'sub' | 'role'>
) => {
  try {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
  } catch (error) {
    throw new Error(
      `Refresh token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Verifies and decodes a JWT token
 * @param token JWT token string
 * @returns Decoded payload
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error(
      `Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Generates an access token
 * @param payload Data to encode in the token
 * @returns Signed JWT access token
 */
export const generateResetToken = (payload: { sub: string }) => {
  try {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '1h',
    });
  } catch (error) {
    throw new Error(
      `Access token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Generates an access token
 * @param payload Data to encode in the token
 * @returns Signed JWT access token
 */
export const generateEmailVerificationToken = (payload: {
  sub: string;
  email: string;
}) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '1h',
  });
};
