import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './index';

describe('Server Entry Point (@nofinite/utils/server)', () => {
  it('exports hashPassword and verifyPassword functions', () => {
    expect(typeof hashPassword).toBe('function');
    expect(typeof verifyPassword).toBe('function');
  });

  it('hashes and verifies a password via server entry export', async () => {
    const password = 'ServerSecretPassword123!';
    const hash = await hashPassword(password);
    expect(hash).toContain('$argon2id$');
    const matches = await verifyPassword(password, hash);
    expect(matches).toBe(true);
  });
});
