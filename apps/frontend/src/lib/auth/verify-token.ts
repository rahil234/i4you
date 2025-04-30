import { jwtVerify, type JWTPayload } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXT_PRIVATE_JWT_SECRET!);

if (!secret) {
  throw new Error('NEXT_PRIVATE_JWT_SECRET is not defined');
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null; // Token is invalid or expired
  }
}
