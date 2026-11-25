import { describe, it, expect, beforeEach } from 'vitest';
import { getJwtSecret } from './jwt-secret';
import { signToken } from './sign-token';
import { verifyToken } from './verify-token';

const VALID_32_BYTE_SECRET = 'a-super-secret-key-that-exceeds-32-bytes-length!';

beforeEach(() => {
  process.env.JWT_SECRET = VALID_32_BYTE_SECRET;
});

describe('JWT utilities (HMAC)', () => {
  it('should sign and verify a token with defaults (HS256)', async () => {
    const token = await signToken({ userId: '123' });

    const payload = await verifyToken(token);

    expect(payload?.userId).toBe('123');
  });

  it('should support HS512 algorithm', async () => {
    const token = await signToken({ role: 'admin' }, { algorithm: 'HS512' });

    const payload = await verifyToken(token);

    expect(payload?.role).toBe('admin');
  });

  it('should return null for invalid token', async () => {
    const payload = await verifyToken('invalid.token.value');

    expect(payload).toBeNull();
  });

  it('should reject secrets shorter than 32 bytes (256 bits) per RFC 7518 (UTILS-SEC-03)', () => {
    process.env.JWT_SECRET = 'short-11-byte';
    expect(() => getJwtSecret()).toThrow(/at least 32 bytes/);
  });

  it('should throw when JWT_SECRET is not defined', () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow('JWT_SECRET is not defined');
  });
});
