/**
 * @license
 * Copyright (C) 2026 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import crypto from 'crypto';

/**
 * Generates an RFC 9562 compliant UUIDv7 string using CSPRNG.
 *
 * Why v7?
 * - Time-ordered timestamp prefix (optimized database indexing)
 * - Cryptographically random entropy (collision resistant)
 * - RFC 9562 official standard
 *
 * @returns UUID string in canonical 8-4-4-4-12 hex format
 */
export function generateUuidV7(): string {
  const bytes = new Uint8Array(16);

  if (typeof crypto !== 'undefined') {
    if (typeof crypto.getRandomValues === 'function') {
      crypto.getRandomValues(bytes);
    } else if (typeof crypto.randomFillSync === 'function') {
      crypto.randomFillSync(bytes);
    }
  }

  // 48-bit timestamp (ms)
  const now = Date.now();
  bytes[0] = Math.floor(now / 0x10000000000) & 0xff;
  bytes[1] = Math.floor(now / 0x100000000) & 0xff;
  bytes[2] = Math.floor(now / 0x1000000) & 0xff;
  bytes[3] = Math.floor(now / 0x10000) & 0xff;
  bytes[4] = Math.floor(now / 0x100) & 0xff;
  bytes[5] = now & 0xff;

  // Version 7: set bits 4-7 to 0111
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // Variant 1: set bits 6-7 to 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  let hex = '';
  for (let i = 0; i < 16; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

/**
 * Canonical alias for generating UUID v7 strings.
 */
export function generateUuid(): string {
  return generateUuidV7();
}

/**
 * Generates a standard random UUID v4 string (RFC 9562 / RFC 4122).
 *
 * Use cases:
 * - Systems requiring purely pseudorandom identifiers without timestamp leakage
 * - Backward compatibility with legacy UUID schemas
 *
 * @returns UUID v4 string in canonical format
 */
export function generateUuidV4(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.getRandomValues === 'function') {
      crypto.getRandomValues(bytes);
    } else if (typeof crypto.randomFillSync === 'function') {
      crypto.randomFillSync(bytes);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 1

  let hex = '';
  for (let i = 0; i < 16; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}
