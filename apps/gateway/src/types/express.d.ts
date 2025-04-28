// types/express.d.ts
import { Auth } from './jwt-payload';

declare module 'express' {
    export interface Request {
        user?: Auth.JwtPayload;
    }
}
