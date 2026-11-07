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
 * Creates a deep copy of an object or value.
 */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fallback for non-serializable objects (functions, symbols)
    }
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }

  if (value instanceof Map) {
    const map = new Map();
    value.forEach((v, k) => map.set(deepClone(k), deepClone(v)));
    return map as unknown as T;
  }

  if (value instanceof Set) {
    const set = new Set();
    value.forEach((v) => set.add(deepClone(v)));
    return set as unknown as T;
  }

  const copy = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value as object)) {
    copy[key] = deepClone((value as Record<string, unknown>)[key]);
  }
  return copy as T;
}

/**
 * Checks if a value is a plain JavaScript object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Recursively merges properties of two or more objects into a new object without mutating originals.
 */
export function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const result: Record<string, unknown> = deepClone(target) as Record<
    string,
    unknown
  >;

  if (!isPlainObject(source)) {
    return result as T & U;
  }

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = result[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = deepClone(sourceValue);
    }
  }

  return result as T & U;
}

/**
 * Creates a new object composed of only the picked object properties.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  if (!obj || typeof obj !== 'object') return result;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Creates a new object composed of the object properties with specified keys omitted.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  if (!obj || typeof obj !== 'object') return result as Omit<T, K>;

  for (const key of keys) {
    delete result[key as string];
  }
  return result as Omit<T, K>;
}

/**
 * Splits a path string or array into normalized property segments.
 */
function parsePath(path: string | (string | number)[]): (string | number)[] {
  if (Array.isArray(path)) return path;
  if (typeof path !== 'string' || path.length === 0) return [];

  // Match property names and array indices: 'a.b[0].c' -> ['a', 'b', 0, 'c']
  const segments: (string | number)[] = [];
  path.replace(/\[(\d+)\]|([a-zA-Z0-9_$]+)/g, (_, index, prop) => {
    if (index !== undefined) {
      segments.push(Number(index));
    } else if (prop !== undefined) {
      segments.push(prop);
    }
    return '';
  });
  return segments;
}

/**
 * Safely retrieves a nested property from an object, returning defaultValue if undefined.
 */
export function get<T = unknown>(
  obj: unknown,
  path: string | (string | number)[],
  defaultValue?: T
): T {
  if (obj === null || obj === undefined) {
    return defaultValue as T;
  }

  const segments = parsePath(path);
  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return defaultValue as T;
    }
    current = (current as Record<string | number, unknown>)[segment];
  }

  return current === undefined ? (defaultValue as T) : (current as T);
}

/**
 * Safely sets a nested property on an object (mutates or populates the path).
 */
export function set<T extends object>(
  obj: T,
  path: string | (string | number)[],
  value: unknown
): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const segments = parsePath(path);
  if (segments.length === 0) return obj;

  let current: Record<string | number, unknown> = obj as Record<
    string | number,
    unknown
  >;

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    const nextKey = segments[i + 1];

    if (
      !(key in current) ||
      current[key] === null ||
      typeof current[key] !== 'object'
    ) {
      current[key] = typeof nextKey === 'number' ? [] : {};
    }
    current = current[key] as Record<string | number, unknown>;
  }

  current[segments[segments.length - 1]] = value;
  return obj;
}

/**
 * Checks if a path exists as a direct or nested property on an object.
 */
export function has(obj: unknown, path: string | (string | number)[]): boolean {
  if (obj === null || obj === undefined) return false;

  const segments = parsePath(path);
  if (segments.length === 0) return false;

  let current: unknown = obj;

  for (const segment of segments) {
    if (
      current === null ||
      current === undefined ||
      !(segment in Object(current))
    ) {
      return false;
    }
    current = (current as Record<string | number, unknown>)[segment];
  }

  return true;
}

/**
 * Deep equality comparison between two values.
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (
    a === null ||
    typeof a !== 'object' ||
    b === null ||
    typeof b !== 'object'
  ) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;

  const keysA = Object.keys(aObj);
  const keysB = Object.keys(bObj);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(bObj, key)) return false;
    if (!isEqual(aObj[key], bObj[key])) return false;
  }

  return true;
}
