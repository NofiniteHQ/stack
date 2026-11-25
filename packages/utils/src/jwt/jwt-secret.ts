/**
 * Resolves and encodes the JWT secret from environment variables.
 *
 * Security notes:
 * - Throws early if secret is missing to avoid silent insecurity.
 * - Enforces minimum 32-byte (256-bit) secret length per RFC 7518 Section 3.2 for HS256 (UTILS-SEC-03).
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const encoded = new TextEncoder().encode(secret);

  if (encoded.length < 32) {
    throw new Error(
      `JWT_SECRET must be at least 32 bytes (256 bits) long per RFC 7518. Current length: ${encoded.length} bytes.`
    );
  }

  return encoded;
}
