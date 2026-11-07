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

  it('should return a SHA-256 hash of the OTP and 16-byte random salt', () => {
    const { otpHash, salt } = generateOtp();

    // SHA-256 hex hash length = 64 characters
    expect(otpHash).toHaveLength(64);
    // 16 bytes = 32 hex chars
    expect(salt).toHaveLength(32);
    expect(salt).toMatch(/^[0-9a-f]{32}$/);
  });

  it('should verify with default salted sha256', () => {
    const { otp, salt, otpHash } = generateOtp();

    expect(verifyOtp(otp, otpHash, { salt })).toBe(true);
  });

  it('should reject verification if salt is incorrect', () => {
    const { otp, otpHash } = generateOtp();

    expect(verifyOtp(otp, otpHash, { salt: 'wrong-salt-value' })).toBe(false);
  });

  it('should reject verification if OTP is incorrect', () => {
    const { salt, otpHash } = generateOtp();

    expect(verifyOtp('999999', otpHash, { salt })).toBe(false);
  });

  it('should work with sha512 when explicitly provided', () => {
    const { otp, salt, otpHash } = generateOtp({ hashAlgorithm: 'sha512' });

    expect(verifyOtp(otp, otpHash, { hashAlgorithm: 'sha512', salt })).toBe(
      true
    );
  });

  it('should fail if hash algorithm does not match', () => {
    const { otp, salt, otpHash } = generateOtp({ hashAlgorithm: 'sha512' });

    // Wrong algorithm during verification
    expect(verifyOtp(otp, otpHash, { hashAlgorithm: 'sha256', salt })).toBe(
      false
    );
  });

  it('supports legacy unsalted OTP generation and verification for backward compatibility', () => {
    const { otp, otpHash } = generateOtp({ salt: '' });
    expect(verifyOtp(otp, otpHash)).toBe(true);
  });
});
