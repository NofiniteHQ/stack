import { describe, it, expect } from 'vitest';
import { hashPassword } from './hash-password';
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

  it('should return false for malformed hash', async () => {
    const isValid = await verifyPassword('password', 'not-a-valid-hash');

    expect(isValid).toBe(false);
  });
});
