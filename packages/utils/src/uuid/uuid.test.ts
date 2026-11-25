import { describe, it, expect } from 'vitest';
import {
  generateUuid,
  generateUuidBuffer,
  uuidToBuffer,
  bufferToUuid,
} from './index';

describe('UUID utilities (v7)', () => {
  it('should generate a valid UUID v7 string', () => {
    const uuid = generateUuid();

    // UUID v7 format check
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('should generate a 16-byte UUID buffer', () => {
    const buffer = generateUuidBuffer();

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBe(16);
  });

  it('should correctly convert uuid -> buffer -> uuid', () => {
    const uuid = generateUuid();

    const buffer = uuidToBuffer(uuid);
    const restored = bufferToUuid(buffer);

    expect(restored).toBe(uuid);
  });

  it('should accept UUIDs without hyphens', () => {
    const uuid = generateUuid().replace(/-/g, '');

    const buffer = uuidToBuffer(uuid);
    const restored = bufferToUuid(buffer);

    expect(restored.replace(/-/g, '')).toBe(uuid);
  });

  it('should convert standard Uint8Array to UUID (UTILS-SEC-04)', () => {
    const canonical = '018f3d96-700a-746b-ab80-985d9a02f0de';
    const hex = canonical.replace(/-/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }

    const reconstructed = bufferToUuid(bytes);
    expect(reconstructed).toBe(canonical);
  });

  it('should reject non-buffer non-uint8array or incorrect lengths', () => {
    expect(() => bufferToUuid(null as any)).toThrow(TypeError);
    expect(() => bufferToUuid(new Uint8Array(10))).toThrow(TypeError);
  });
});
