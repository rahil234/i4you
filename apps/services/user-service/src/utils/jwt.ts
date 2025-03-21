import jwt from 'jsonwebtoken';
import config from '../config';

// Payload interface for type safety
interface JwtPayload {
    id: string;
    email: string;
    [key: string]: any; // Allow additional claims
}

/**
 * Generates a JWT token
 * @param payload Data to encode in the token
 * @returns Signed JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
    try {
        return jwt.sign(
            payload,
            "rahil",
            { expiresIn: '15m' }
        );
        // return jwt.sign(
        //     payload,
        //     config.jwtSecret,
        //     { expiresIn: config.jwtExpiresIn }
        // );
    } catch (error) {
        throw new Error(`Token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Verifies and decodes a JWT token
 * @param token JWT token string
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (error) {
        throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Extracts token from Authorization header
 * @param header Authorization header value
 * @returns Token string or null if invalid
 */
export const extractToken = (header: string | undefined): string | null => {
    if (!header || !header.startsWith('Bearer ')) {
        return null;
    }
    return header.split(' ')[1];
};