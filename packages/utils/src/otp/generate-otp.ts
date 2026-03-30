import crypto from 'crypto';
import { GeneratedOtp, OtpOptions } from './otp.types';

/**
 * Generates a cryptographically secure numeric OTP and hashes it.
 *
 * Security notes:
 * - Uses CSPRNG via `crypto.randomInt`
 * - OTP is returned as a string to preserve leading zeros
 * - Hashing algorithm defaults to SHA-256
 *
 * @param options - Optional OTP configuration
 * @returns Generated OTP and its hash
 */

export function generateOtp(options: OtpOptions = {}): GeneratedOtp {
  const { hashAlgorithm = 'sha256' } = options;

  // Generate secure random 6-digit OTP
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');

  // Hash OTP using selected algorithm
  const otpHash = crypto
    .createHash(hashAlgorithm)
    .update(otp)
    .digest('hex');

  return { otp, otpHash };
}
