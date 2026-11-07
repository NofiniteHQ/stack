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
 * Converts a UUID string into a binary buffer with strict 16-byte validation.
 *
 * Useful when:
 * - Accepting UUIDs from APIs
 * - Storing them efficiently in databases
 *
 * @param uuid - UUID string (with or without hyphens)
 * @returns A 16-byte Buffer
 * @throws {TypeError} If the string is not a valid 16-byte (32 hex digit) UUID
 */
export function uuidToBuffer(uuid: string): Buffer {
  if (typeof uuid !== 'string') {
    throw new TypeError('Invalid UUID: argument must be a string');
  }

  const hex = uuid.replace(/-/g, '').trim();
  if (hex.length !== 32 || !/^[0-9a-fA-F]{32}$/.test(hex)) {
    throw new TypeError(
      `Invalid UUID string: expected 32 hexadecimal characters (16 bytes), received ${hex.length}`
    );
  }

  const buffer = Buffer.from(hex, 'hex');
  if (buffer.length !== 16) {
    throw new TypeError(
      `Invalid UUID buffer length: expected exactly 16 bytes, received ${buffer.length}`
    );
  }

  return buffer;
}

/**
 * Converts a binary UUID buffer or Uint8Array back into a standard UUID string with strict 16-byte validation.
 * Supports universal Uint8Array for browser/worker isomorphism (UTILS-SEC-04).
 *
 * @param buffer - A 16-byte UUID Buffer or Uint8Array
 * @returns UUID string in canonical format
 * @throws {TypeError} If the buffer is not a valid 16-byte Buffer or Uint8Array
 */
export function bufferToUuid(buffer: Uint8Array | Buffer): string {
  if (
    !buffer ||
    (!(buffer instanceof Uint8Array) && !Buffer.isBuffer(buffer))
  ) {
    throw new TypeError(
      'Invalid UUID buffer: argument must be a Buffer or Uint8Array instance'
    );
  }

  if (buffer.length !== 16) {
    throw new TypeError(
      `Invalid UUID buffer length: expected exactly 16 bytes, received ${buffer.length}`
    );
  }

  let hex = '';
  for (let i = 0; i < 16; i++) {
    hex += buffer[i].toString(16).padStart(2, '0');
  }

  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20),
  ].join('-');
}
