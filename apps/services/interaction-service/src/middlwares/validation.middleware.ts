import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function validationMiddleware<T extends object>(
  type: new () => T
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const dtoObj = plainToInstance(type, req.body);

    validate(dtoObj, { whitelist: true, forbidNonWhitelisted: true }).then(
      (errors) => {
        if (errors.length > 0) {
          const messages = errors
            .map((err) => Object.values(err.constraints || {}))
            .flat();
          res.status(400).json({ errors: messages });
        } else {
          req.body = dtoObj;
          next();
        }
      }
    );
  };
}
