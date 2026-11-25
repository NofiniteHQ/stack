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

/**
 * Validates whether a string is a properly formatted email address.
 */
export function isEmail(str: unknown): str is string {
  if (typeof str !== 'string' || str.length === 0 || str.length > 254)
    return false;
  // RFC 5322 compliant practical regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(str);
}

/**
 * Validates whether a string is a valid absolute URL with http, https, or ftp protocol.
 */
export function isUrl(str: unknown): str is string {
  if (typeof str !== 'string' || str.length === 0) return false;
  try {
    const url = new URL(str);
    return ['http:', 'https:', 'ftp:'].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Validates whether a string is a standard RFC UUID, optionally pinned to version 4 or 7.
 */
export function isUuid(str: unknown, version?: 4 | 7): str is string {
  if (typeof str !== 'string') return false;

  if (version === 4) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str
    );
  }

  if (version === 7) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str
    );
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str
  );
}

/**
 * Checks whether a value is null or undefined.
 */
export function isNil(val: unknown): val is null | undefined {
  return val === null || val === undefined;
}

/**
 * Checks if a value is an empty string, array, map, set, or object without own properties.
 */
export function isEmpty(val: unknown): boolean {
  if (isNil(val)) return true;
  if (typeof val === 'string' || Array.isArray(val)) return val.length === 0;
  if (val instanceof Map || val instanceof Set) return val.size === 0;
  if (typeof val === 'object') return Object.keys(val as object).length === 0;
  return false;
}

/**
 * Checks if a value is an object (excluding null and functions).
 */
export function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object';
}

/**
 * Checks if a value is a plain JavaScript object.
 */
export function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (!isObject(val)) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

/**
 * Type-guard checking if value is an Array.
 */
export function isArray(val: unknown): val is unknown[] {
  return Array.isArray(val);
}

/**
 * Type-guard checking if value is a string.
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

/**
 * Type-guard checking if value is a valid finite number (excluding NaN and Infinity).
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

/**
 * Type-guard checking if value is a boolean.
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean';
}
