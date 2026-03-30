import { describe, it, expect } from 'vitest';
import { generateOtp } from './generate-otp';
import { verifyOtp } from './verify-otp';

describe('OTP & OTP hashing algorithms', () => {
  it('should generate a 6-digit numeric OTP', () => {
    const { otp } = generateOtp();

    expect(otp).toMatch(/^\d{6}$/);
  });

  it('should always return otp as a string (preserve leading zeros)', () => {
    const { otp } = generateOtp();

    expect(typeof otp).toBe('string');
  });

  it('should return a SHA-256 hash of the OTP', () => {
    const { otpHash } = generateOtp();

    // SHA-256 hex hash length = 64 characters
    expect(otpHash).toHaveLength(64);
  });

  it('should work with default (sha256)', () => {
    const { otp, otpHash } = generateOtp();

    expect(verifyOtp(otp, otpHash)).toBe(true);
  });

  it('should work with sha512 when explicitly provided', () => {
    const { otp, otpHash } = generateOtp({ hashAlgorithm: 'sha512' });

    expect(verifyOtp(otp, otpHash, { hashAlgorithm: 'sha512' })).toBe(true);
  });

  it('should fail if hash algorithm does not match', () => {
    const { otp, otpHash } = generateOtp({ hashAlgorithm: 'sha512' });

    // Wrong algorithm during verification
    expect(verifyOtp(otp, otpHash, { hashAlgorithm: 'sha256' })).toBe(false);
  });
});
