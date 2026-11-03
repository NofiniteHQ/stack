import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';

/**
 * Generates a UUID v7 string.
 *
 * Why v7?
 * - Time-ordered (better DB indexes)
 * - Collision-resistant
 * - RFC 9562 standard replacing v4 in many modern systems
 *
 * @returns UUID string in canonical format
 */
export function generateUuid(): string {
  return uuidv7();
}

/**
 * Explicit alias for generating UUID v7 strings.
 */
export function generateUuidV7(): string {
  return uuidv7();
}

/**
 * Generates a standard random UUID v4 string (RFC 9562 / RFC 4122).
 *
 * Use cases:
 * - Systems requiring purely pseudorandom identifiers without timestamp leakage
 * - Backward compatibility with legacy UUID v4 schemas
 *
 * @returns UUID v4 string in canonical format
 */
export function generateUuidV4(): string {
  return uuidv4();
}
