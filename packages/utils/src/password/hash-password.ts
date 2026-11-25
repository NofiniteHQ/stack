let argon2Instance: typeof import('argon2') | null = null;

async function getArgon2(): Promise<typeof import('argon2')> {
  if (!argon2Instance) {
    try {
      const mod = await import('argon2');
      argon2Instance = (mod.default || mod) as typeof import('argon2');
    } catch (err: any) {
      throw new Error(`argon2 is not installed or available: ${err.message}`);
    }
  }
  return argon2Instance;
}
import { PasswordHashOptions } from './password.types';

export const MAX_PASSWORD_LENGTH = 128;

/**
 * Hashes a plain-text password using Argon2id.
 *
 * Why Argon2id?
 * - Resistant to GPU & ASIC attacks
 * - Safe against side-channel attacks
 * - Recommended by OWASP and RFC 9106
 *
 * Security notes:
 * - Always store the returned hash as-is
 * - Never truncate or re-hash it
 * - Hash includes salt & parameters internally
 * - Enforces maximum password length of 128 characters to prevent CPU/memory exhaustion DoS (UTILS-SEC-02)
 *
 * @param password - Plain-text password
 * @param options  - Optional tuning parameters (default parallelism: 4 per RFC 9106)
 * @returns Argon2id hash string
 */
export async function hashPassword(
  password: string,
  options: PasswordHashOptions = {}
): Promise<string> {
  if (typeof password !== 'string' || password.length === 0) {
    throw new TypeError('Password must be a non-empty string');
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(
      `Password length (${password.length}) exceeds the maximum allowed limit of ${MAX_PASSWORD_LENGTH} characters.`
    );
  }

  const argon2 = await getArgon2();
  return argon2.hash(password, {
    type: argon2.argon2id,

    // Secure defaults aligned with RFC 9106 / OWASP recommended profile
    memoryCost: options.memoryCost ?? 2 ** 16, // 64 MB
    timeCost: options.timeCost ?? 3,
    parallelism: options.parallelism ?? 4,
  });
}
