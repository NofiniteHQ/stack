import { jwtVerify } from 'jose';
import { getJwtSecret } from './jwt-secret';
import { JwtPayload, JwtVerifyOptions } from './jwt.types';

/**
 * Verifies a JWT and returns its payload.
 *
 * Notes:
 * - Returns `null` on failure instead of throwing
 * - Validates signature, expiration, and optional claims
 *
 * @param token   - JWT string
 * @param options - Verification constraints
 * @returns Decoded JWT payload or null
 */
export async function verifyToken(
  token: string,
  options: JwtVerifyOptions = {},
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      getJwtSecret(),
      options,
    );

    return payload;
  } catch {
    return null;
  }
}
