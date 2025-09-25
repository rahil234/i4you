export const USER_RESPONSE_MESSAGES = {
  NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  UPDATED: 'User updated successfully',
  STATUS_UPDATED: 'User status updated successfully',
  INVALID_ID: 'Invalid user ID',
  INVALID_UPDATE_DATA: 'Invalid update data',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const AUTH_RESPONSE_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'User created and verification email sent successfully',
  ADMIN_LOGIN_SUCCESS: 'Admin login successful',

  GOOGLE_TOKEN_REQUIRED: 'Google token is required',
  GOOGLE_REGISTER_SUCCESS: 'User registered successfully with Google',
  GOOGLE_LOGIN_SUCCESS: 'Google login successful',

  FACEBOOK_TOKEN_REQUIRED: 'Facebook token is required',
  FACEBOOK_REGISTER_SUCCESS: 'User registered successfully with Facebook',
  FACEBOOK_REGISTER_FAILED: 'Registration failed. Please try again later.',
  FACEBOOK_LOGIN_SUCCESS: 'Facebook login successful',

  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'currentPassword and newPassword is required',
  PASSWORD_CHANGED: 'Password changed successfully',
  FORGOT_PASSWORD_EMAIL_REQUIRED: 'Email is required',
  FORGOT_PASSWORD_SUCCESS: 'Password reset link sent',
  RESET_PASSWORD_REQUIRED: 'password and token is required',
  RESET_PASSWORD_SUCCESS: 'Password changed successfully',

  VERIFY_ACCOUNT_REQUIRED: 'password and token is required',
  VERIFY_ACCOUNT_SUCCESS: 'Account verification successful',

  REFRESH_TOKEN_MISSING: 'Refresh token is missing',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;
