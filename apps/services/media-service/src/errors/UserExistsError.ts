// src/errors/UserExistsError.ts
import { AppError } from './AppError';

export class UserExistsError extends AppError {
  constructor(message = 'User already exists') {
    super(message, 409, 'USER_EXISTS');
  }
}