import { describe, it, expect } from 'vitest';
import { isOtpExpired } from './is-otp-expired';
import { hasExceededOtpAttempts } from './has-exceeded-otp-attempts';

describe('OTP guard helpers', () => {
  it('should return false for non-expired OTP', () => {
    const createdAt = new Date(Date.now() - 2 * 60 * 1000); // 2 min ago

    expect(isOtpExpired(createdAt, 300)).toBe(false);
  });

  it('should return true for expired OTP', () => {
    const createdAt = new Date(Date.now() - 10 * 60 * 1000); // 10 min ago

    expect(isOtpExpired(createdAt, 300)).toBe(true);
  });

  it('should detect exceeded OTP attempts', () => {
    expect(hasExceededOtpAttempts(3, 3)).toBe(true);
    expect(hasExceededOtpAttempts(2, 3)).toBe(false);
  });
});
