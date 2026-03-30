import argon2 from 'argon2';
import { PasswordHashOptions } from './password.types';

/**
 * Hashes a plain-text password using Argon2id.
 *
 * Why Argon2id?
 * - Resistant to GPU & ASIC attacks
 * - Safe against side-channel attacks
 * - Recommended by OWASP
 *
 * Security notes:
 * - Always store the returned hash as-is
 * - Never truncate or re-hash it
 * - Hash includes salt & parameters internally
 *
 * @param password - Plain-text password
 * @param options  - Optional tuning parameters
 * @returns Argon2id hash string
 */
export async function hashPassword(
  password: string,
  options: PasswordHashOptions = {},
): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,

    // Secure defaults (server-friendly)
    memoryCost: options.memoryCost ?? 2 ** 16, // 64 MB
    timeCost: options.timeCost ?? 3,
    parallelism: options.parallelism ?? 1,
  });
}
