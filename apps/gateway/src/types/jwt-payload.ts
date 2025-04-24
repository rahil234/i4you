// types/jwt-payload.ts
export namespace Auth {
    export interface JwtPayload {
        sub: string; // User ID
        role: string; // User role
        name: string; // User name
        iat?: number; // Issued at (optional)
        exp?: number; // Expiration (optional)
    }
}