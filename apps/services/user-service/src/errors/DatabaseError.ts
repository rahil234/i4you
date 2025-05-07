import { AppError } from './AppError';

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
  }
}
