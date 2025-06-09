import { HttpError } from './HttpError.js';

type CreateErrorType = {
  (statusCode: number, message: string, errorCode?: string, data?: any): HttpError;

  Continue: (message?: string, errorCode?: string, data?: any) => HttpError;
  SwitchingProtocols: (message?: string, errorCode?: string, data?: any) => HttpError;
  OK: (message?: string, errorCode?: string, data?: any) => HttpError;
  Created: (message?: string, errorCode?: string, data?: any) => HttpError;
  Accepted: (message?: string, errorCode?: string, data?: any) => HttpError;
  NoContent: (message?: string, errorCode?: string, data?: any) => HttpError;
  BadRequest: (message?: string, errorCode?: string, data?: any) => HttpError;
  Unauthorized: (message?: string, errorCode?: string, data?: any) => HttpError;
  Forbidden: (message?: string, errorCode?: string, data?: any) => HttpError;
  NotFound: (message?: string, errorCode?: string, data?: any) => HttpError;
  MethodNotAllowed: (message?: string, errorCode?: string, data?: any) => HttpError;
  Conflict: (message?: string, errorCode?: string, data?: any) => HttpError;
  Gone: (message?: string, errorCode?: string, data?: any) => HttpError;
  UnprocessableEntity: (message?: string, errorCode?: string, data?: any) => HttpError;
  TooManyRequests: (message?: string, errorCode?: string, data?: any) => HttpError;
  Internal: (message?: string, errorCode?: string, data?: any) => HttpError;
  NotImplemented: (message?: string, errorCode?: string, data?: any) => HttpError;
  BadGateway: (message?: string, errorCode?: string, data?: any) => HttpError;
  ServiceUnavailable: (message?: string, errorCode?: string, data?: any) => HttpError;
  GatewayTimeout: (message?: string, errorCode?: string, data?: any) => HttpError;
};

const create = (
  statusCode: number,
  message: string,
  errorCode?: string,
  data?: any
): HttpError => {
  const error = new HttpError(statusCode, message, errorCode, data);
  Error.captureStackTrace(error, create);
  return error;
};

const make = (statusCode: number, defaultMessage: string) =>
  function customError(message = defaultMessage, errorCode?: string, data?: any): HttpError {
    const error = new HttpError(statusCode, message, errorCode, data);
    Error.captureStackTrace(error, customError);
    return error;
  };

export const createError: CreateErrorType = Object.assign(create, {
  Continue: make(100, 'Continue'),
  SwitchingProtocols: make(101, 'Switching Protocols'),
  OK: make(200, 'OK'),
  Created: make(201, 'Created'),
  Accepted: make(202, 'Accepted'),
  NoContent: make(204, 'No Content'),

  BadRequest: make(400, 'Bad Request'),
  Unauthorized: make(401, 'Unauthorized'),
  Forbidden: make(403, 'Forbidden'),
  NotFound: make(404, 'Not Found'),
  MethodNotAllowed: make(405, 'Method Not Allowed'),
  Conflict: make(409, 'Conflict'),
  Gone: make(410, 'Gone'),
  UnprocessableEntity: make(422, 'Unprocessable Entity'),
  TooManyRequests: make(429, 'Too Many Requests'),

  Internal: make(500, 'Internal Server Error'),
  NotImplemented: make(501, 'Not Implemented'),
  BadGateway: make(502, 'Bad Gateway'),
  ServiceUnavailable: make(503, 'Service Unavailable'),
  GatewayTimeout: make(504, 'Gateway Timeout'),
});