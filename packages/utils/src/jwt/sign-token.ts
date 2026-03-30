import { SignJWT } from 'jose';
import { getJwtSecret } from './jwt-secret';
import { JwtPayload, JwtSignOptions } from './jwt.types';

/**
 * Signs a JWT using HMAC (HS256 by default).
 *
 * Security notes:
 * - Uses symmetric secret (process.env.JWT_SECRET)
 * - Issued-at is always set
 * - Expiration defaults to 7 days
 *
 * @param payload - JWT payload (claims)
 * @param options - Signing options
 * @returns Signed JWT string
 */
export async function signToken(
  payload: JwtPayload,
  options: JwtSignOptions = {},
): Promise<string> {
  const {
    algorithm = 'HS256',
    expiresIn = '7d',
    issuer,
    audience,
  } = options;

  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expiresIn);

  if (issuer) jwt.setIssuer(issuer);
  if (audience) jwt.setAudience(audience);

  return jwt.sign(getJwtSecret());
}
