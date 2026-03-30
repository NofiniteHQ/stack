import { describe, it, expect, beforeAll } from 'vitest';
import { signToken } from './sign-token';
import { verifyToken } from './verify-token';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('JWT utilities (HMAC)', () => {
  it('should sign and verify a token with defaults (HS256)', async () => {
    const token = await signToken({ userId: '123' });

    const payload = await verifyToken(token);

    expect(payload?.userId).toBe('123');
  });

  it('should support HS512 algorithm', async () => {
    const token = await signToken(
      { role: 'admin' },
      { algorithm: 'HS512' },
    );

    const payload = await verifyToken(token);

    expect(payload?.role).toBe('admin');
  });

  it('should return null for invalid token', async () => {
    const payload = await verifyToken('invalid.token.value');

    expect(payload).toBeNull();
  });
});
