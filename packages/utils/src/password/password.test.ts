import { describe, it, expect } from 'vitest';
import { hashPassword, MAX_PASSWORD_LENGTH } from './hash-password';
import { verifyPassword } from './verify-password';

describe('password hashing (argon2id)', () => {
  it('should hash and verify a correct password', async () => {
    const password = 'StrongP@ssw0rd!';

    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('should fail verification for wrong password', async () => {
    const hash = await hashPassword('correct-password');

    const isValid = await verifyPassword('wrong-password', hash);

    expect(isValid).toBe(false);
  });

  it('should return false for malformed hash with dummy verification execution', async () => {
    const isValid = await verifyPassword('password', 'not-a-valid-hash');

    expect(isValid).toBe(false);
  });

  it('should reject passwords exceeding 128 characters during hashing (UTILS-SEC-02)', async () => {
    const longPassword = 'a'.repeat(MAX_PASSWORD_LENGTH + 1);

    await expect(hashPassword(longPassword)).rejects.toThrow(
      /exceeds the maximum allowed limit/
    );
  });

  it('should return false for passwords exceeding 128 characters during verification', async () => {
    const longPassword = 'a'.repeat(MAX_PASSWORD_LENGTH + 1);
    const validHash = await hashPassword('normal-password');

    const isValid = await verifyPassword(longPassword, validHash);
    expect(isValid).toBe(false);
  });

  it('should reject empty or non-string passwords', async () => {
    await expect(hashPassword('')).rejects.toThrow(TypeError);
    await expect(hashPassword(null as any)).rejects.toThrow(TypeError);
  });
});
