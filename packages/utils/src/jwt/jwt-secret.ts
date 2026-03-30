/**
 * Resolves and encodes the JWT secret from environment variables.
 *
 * Throws early if secret is missing to avoid silent insecurity.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return new TextEncoder().encode(secret);
}
