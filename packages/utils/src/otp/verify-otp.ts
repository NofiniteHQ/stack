import crypto from 'crypto';
import { OtpOptions } from './otp.types';

/**
 * Verifies a user-provided OTP against a stored hash using constant-time comparison.
 *
 * Security notes:
 * - Uses constant-time comparison (`timingSafeEqual`)
 * - Supports salted OTP verification (pass `options.salt`) to defeat rainbow tables
 * - Hashing algorithm MUST match the one used during generation
 *
 * @param inputOtp   - OTP entered by the user
 * @param storedHash - Stored OTP hash
 * @param options    - Verification options (including salt)
 * @returns `true` if OTP is valid, otherwise `false`
 */
export function verifyOtp(
  inputOtp: string,
  storedHash: string,
  options: OtpOptions = {}
): boolean {
  if (typeof inputOtp !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  const { hashAlgorithm = 'sha256', salt } = options;

  const hashPayload = salt ? `${salt}:${inputOtp}` : inputOtp;

  const inputHash = crypto
    .createHash(hashAlgorithm)
    .update(hashPayload)
    .digest('hex');

  const inputBuffer = Buffer.from(inputHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  // Prevent timingSafeEqual crash on length mismatch or empty buffer
  if (inputBuffer.length !== storedBuffer.length || storedBuffer.length === 0) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}
