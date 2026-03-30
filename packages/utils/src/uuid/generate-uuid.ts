import { v7 as uuidv7 } from 'uuid';

/**
 * Generates a UUID v7 string.
 *
 * Why v7?
 * - Time-ordered (better DB indexes)
 * - Collision-resistant
 * - RFC draft standard replacing v4 in many systems
 *
 * @returns UUID string in canonical format
 */
export function generateUuid(): string {
  return uuidv7();
}
