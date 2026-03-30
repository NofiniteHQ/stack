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
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
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
});
