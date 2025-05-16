export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  type: string;

  constructor(message: string, statusCode = 500, type = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}