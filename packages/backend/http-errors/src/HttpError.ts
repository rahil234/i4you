export class HttpError extends Error {
  statusCode: number;
  errorCode?: string;
  data?: any;

  constructor(statusCode: number, message: string, errorCode?: string, data?: any) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
    Error.captureStackTrace(this, HttpError);
  }
}