import argon2 from 'argon2';

/**
 * Verifies a plain-text password against a stored Argon2 hash.
 *
 * Notes:
 * - Automatically extracts salt & parameters from hash
 * - Uses constant-time comparison internally
 *
 * @param password - User-provided password
 * @param hash     - Stored Argon2 hash
 * @returns `true` if password matches, otherwise `false`
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    // Covers malformed hash or invalid input
    return false;
  }
}
