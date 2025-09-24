export const CONSTANTS = {
  TOKEN: {
    ACCESS_BLACKLIST_PREFIX: 'blacklist:',
    REFRESH_PREFIX: 'refresh:',
    REFRESH_TTL: 60 * 60 * 24 * 7,
    ACCESS_BLACKLIST_TTL: 60 * 20,
  },
  ERRORS: {
    INVALID_CREDENTIALS:
      'Invalid credentials. please check your email or password',
    VERIFY_EMAIL: 'Please verify your email address',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS_SIMPLE: 'Invalid credentials',
    ALL_FIELDS_REQUIRED: 'All fields are required',
    USER_EXISTS: 'User already exists with this email. Please login.',
    REGISTRATION_FAILED: 'Registration failed. Please try again later.',
    RESET_PASSWORD_SUBJECT: 'Reset Your Password',
    VERIFY_ACCOUNT_SUBJECT: 'Verify your i4you account',
    INVALID_TOKEN: 'Invalid token',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    FAILED_CREATE_USER: 'Failed to create user. try again later.',
    NOT_IMPLEMENTED: 'NOT IMPLEMENTED',
    TOKEN_REQUIRED: 'Token is required',
  },
  ROUTES: {
    VERIFY_PATH: '/verify?token=',
    RESET_PASSWORD_PATH: '/reset-password?token=',
  },
};
