import crypto from 'crypto';
import { GeneratedOtp, OtpOptions } from './otp.types';

/**
 * Generates a cryptographically secure numeric OTP and hashes it with a random salt.
 *
 * Security notes:
 * - Uses CSPRNG via `crypto.randomInt`
 * - OTP is returned as a 6-digit string to preserve leading zeros
 * - Generates a 16-byte random hex salt by default to defeat rainbow table attacks (UTILS-SEC-01)
 * - Hashing algorithm defaults to SHA-256
 *
 * @param options - Optional OTP configuration
 * @returns Generated OTP, salt, and its hash
 */
export function generateOtp(options: OtpOptions = {}): GeneratedOtp {
  const { hashAlgorithm = 'sha256' } = options;

  // Generate secure random 6-digit OTP
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');

  // Generate 16-byte random salt by default (or use provided salt)
  const salt =
    options.salt !== undefined
      ? options.salt
      : crypto.randomBytes(16).toString('hex');

  // Hash OTP using selected algorithm and salt
  const hashPayload = salt ? `${salt}:${otp}` : otp;
  const otpHash = crypto
    .createHash(hashAlgorithm)
    .update(hashPayload)
    .digest('hex');

  return { otp, salt, otpHash };
}
