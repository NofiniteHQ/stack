import argon2 from 'argon2';

// Pre-computed valid Argon2id hash used to perform dummy verification on invalid inputs,
// equalizing response latency and mitigating user enumeration timing attacks (UTILS-SEC-02).
const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRmb3JkdW1teTAx$t7Q9w5sJ4l2R0uV8zP3k1M6n9b8v7c6x5z4y3w2v1u0';

/**
 * Verifies a plain-text password against a stored Argon2 hash.
 *
 * Notes:
 * - Automatically extracts salt & parameters from hash
 * - Uses constant-time comparison internally
 * - Performs constant-time dummy verification on malformed hash/invalid password to prevent timing attacks (UTILS-SEC-02)
 *
 * @param password - User-provided password
 * @param hash     - Stored Argon2 hash
 * @returns `true` if password matches, otherwise `false`
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (
    typeof password !== 'string' ||
    password.length === 0 ||
    password.length > 128 ||
    typeof hash !== 'string' ||
    !hash.startsWith('$argon2')
  ) {
    try {
      await argon2.verify(DUMMY_HASH, 'dummy_verification_string');
    } catch {
      // Ignore fallback verify errors
    }
    return false;
  }

  try {
    return await argon2.verify(hash, password);
  } catch {
    // Covers malformed hash or internal error
    return false;
  }
}
