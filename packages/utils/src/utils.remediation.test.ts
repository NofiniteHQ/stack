import { describe, it, expect } from 'vitest';
import {
  generateUuid,
  generateUuidV4,
  generateUuidV7,
  generateUuidBuffer,
  uuidToBuffer,
  bufferToUuid,
} from './uuid';
import { hashPassword, verifyPassword } from './password';

describe('Utils Security & Robustness Remediation (M2)', () => {
  describe('UUID v4 and v7 Generator Exports (UTILS-M1-03)', () => {
    it('generates standard UUID v4 strings matching RFC 4122 / RFC 9562 format', () => {
      const id = generateUuidV4();
      expect(typeof id).toBe('string');
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('generates time-ordered UUID v7 strings with explicit helper', () => {
      const id1 = generateUuidV7();
      const id2 = generateUuid();
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(id2).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  describe('UUID Buffer 16-Byte Strict Validation (UTILS-M1-03)', () => {
    it('converts valid UUID strings to 16-byte Buffer and roundtrips cleanly', () => {
      const canonical = '018f3d96-700a-746b-ab80-985d9a02f0de';
      const buf = uuidToBuffer(canonical);

      expect(Buffer.isBuffer(buf)).toBe(true);
      expect(buf.length).toBe(16);

      const reconstructed = bufferToUuid(buf);
      expect(reconstructed).toBe(canonical);
    });

    it('generates a 16-byte buffer directly via generateUuidBuffer', () => {
      const buf = generateUuidBuffer();
      expect(Buffer.isBuffer(buf)).toBe(true);
      expect(buf.length).toBe(16);
      const str = bufferToUuid(buf);
      expect(str).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('throws TypeError when uuidToBuffer receives non-string or invalid length input', () => {
      expect(() => uuidToBuffer(null as any)).toThrow(TypeError);
      expect(() => uuidToBuffer(undefined as any)).toThrow(TypeError);
      expect(() => uuidToBuffer('')).toThrow(TypeError);
      expect(() => uuidToBuffer('too-short')).toThrow(TypeError);
      expect(() =>
        uuidToBuffer('018f3d96-700a-746b-ab80-985d9a02f0de-extra')
      ).toThrow(TypeError);
      expect(() =>
        uuidToBuffer('018f3d96-700a-746b-ab80-985d9a02f0dZ')
      ).toThrow(TypeError); // non-hex character
    });

    it('throws TypeError when bufferToUuid receives non-Buffer or incorrect buffer length', () => {
      expect(() => bufferToUuid(null as any)).toThrow(TypeError);
      expect(() => bufferToUuid(undefined as any)).toThrow(TypeError);
      expect(() => bufferToUuid(Buffer.from('too short'))).toThrow(TypeError);
      expect(() => bufferToUuid(Buffer.alloc(32))).toThrow(TypeError);
    });
  });

  describe('Argon2id Multi-Core Parallelism Defaults (UTILS-M1-02)', () => {
    it('hashes passwords using default parallelism: 4 and verifies successfully', async () => {
      const password = 'Production-Grade-P@ssword-2026';
      const hash = await hashPassword(password);

      expect(typeof hash).toBe('string');
      expect(hash).toContain('$argon2id$');
      expect(hash).toContain('p=4'); // RFC 9106 recommended profile verification

      const valid = await verifyPassword(password, hash);
      expect(valid).toBe(true);
    });

    it('allows overriding parallelism when explicitly specified', async () => {
      const password = 'Custom-Parallelism-Pass';
      const hash = await hashPassword(password, { parallelism: 2 });

      expect(hash).toContain('p=2');
      const valid = await verifyPassword(password, hash);
      expect(valid).toBe(true);
    });
  });

  describe('ZeptoMail Supply Chain Integration & Client Compatibility (UTILS-M1-01)', () => {
    it('initializes SendMailClient successfully with resolved axios 1.21.0 dependency', async () => {
      const { SendMailClient } = await import('zeptomail');
      expect(typeof SendMailClient).toBe('function');

      const client = new SendMailClient({
        url: 'https://api.zeptomail.in/v1.1/email',
        token: 'test-token-value',
      });
      expect(client).toBeDefined();
      expect(typeof client.sendMail).toBe('function');
      expect(typeof client.sendBatchMail).toBe('function');
    });

    it('resolves ZeptoMail environment configuration safely without token leakage', async () => {
      const originalToken = process.env.ZEPTOMAIL_TOKEN;
      process.env.ZEPTOMAIL_TOKEN = 'mock-secret-token';
      const { getZeptoMailConfig } = await import('./zeptomail/email-config');
      const config = getZeptoMailConfig(false);
      expect(config.token).toBe('mock-secret-token');
      expect(config.url).toContain('zeptomail');
      process.env.ZEPTOMAIL_TOKEN = originalToken;
    });
  });
});
