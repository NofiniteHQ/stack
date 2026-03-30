import { v7 as uuidv7 } from 'uuid';

/**
 * Generates a UUID v7 and returns it as a raw binary buffer.
 *
 * Use cases:
 * - Compact database storage (BINARY(16))
 * - Faster indexing compared to string UUIDs
 *
 * Notes:
 * - UUID v7 is time-ordered
 * - Hyphens are removed before hex-to-buffer conversion
 *
 * @returns A 16-byte Buffer representing the UUID
 */
export function generateUuidBuffer(): Buffer {
  return Buffer.from(uuidv7().replace(/-/g, ''), 'hex');
}

/**
 * Converts a UUID string into a binary buffer.
 *
 * Useful when:
 * - Accepting UUIDs from APIs
 * - Storing them efficiently in databases
 *
 * @param uuid - UUID string (with or without hyphens)
 * @returns A 16-byte Buffer
 */
export function uuidToBuffer(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

/**
 * Converts a binary UUID buffer back into a standard UUID string.
 *
 * @param buffer - A 16-byte UUID buffer
 * @returns UUID string in canonical format
 */
export function bufferToUuid(buffer: Buffer): string {
  const hex = buffer.toString('hex');

  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20),
  ].join('-');
}
