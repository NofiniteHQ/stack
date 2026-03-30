import crypto from 'crypto';
import { OtpOptions } from './otp.types';

/**
 * Verifies a user-provided OTP against a stored hash.
 *
 * Security notes:
 * - Uses constant-time comparison (`timingSafeEqual`)
 * - Hashing algorithm MUST match the one used during generation
 *
 * @param inputOtp   - OTP entered by the user
 * @param storedHash - Stored OTP hash
 * @param options    - Verification options
 * @returns `true` if OTP is valid, otherwise `false`
 */

export function verifyOtp(
  inputOtp: string,
  storedHash: string,
  options: OtpOptions = {},
): boolean {
  const { hashAlgorithm = 'sha256' } = options;

  const inputHash = crypto
    .createHash(hashAlgorithm)
    .update(inputOtp)
    .digest('hex');

  const inputBuffer = Buffer.from(inputHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  // Prevent timingSafeEqual crash on length mismatch
  if (inputBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}
