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
 * Splits an array into groups of elements of the specified size.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (!Array.isArray(arr) || size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Returns a duplicate-free array, optionally by a key transformer function.
 */
export function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  if (!Array.isArray(arr)) return [];
  if (!keyFn) {
    return Array.from(new Set(arr));
  }

  const seen = new Set();
  const result: T[] = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Groups array items into an object indexed by the key returned by the callback.
 */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  if (!Array.isArray(arr)) return result;

  for (const item of arr) {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

/**
 * Maps array items into an object with keys mapped by keyFn. Later items overwrite earlier ones.
 */
export function keyBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T> {
  const result = {} as Record<K, T>;
  if (!Array.isArray(arr)) return result;

  for (const item of arr) {
    result[keyFn(item)] = item;
  }
  return result;
}

/**
 * Shuffles an array into a new randomized array using Fisher-Yates algorithm.
 */
export function shuffle<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) return [];
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Gets a random element from an array.
 */
export function sample<T>(arr: T[]): T | undefined {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Gets n random unique elements from an array.
 */
export function sampleSize<T>(arr: T[], n: number): T[] {
  if (!Array.isArray(arr) || n <= 0) return [];
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

/**
 * Computes the intersection of multiple arrays.
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return unique(arrays[0]);

  let current = new Set(arrays[0]);
  for (let i = 1; i < arrays.length; i++) {
    const nextSet = new Set(arrays[i]);
    current = new Set([...current].filter((item) => nextSet.has(item)));
  }
  return Array.from(current);
}

/**
 * Computes the difference between the first array and subsequent arrays.
 */
export function difference<T>(arr: T[], ...exclude: T[][]): T[] {
  if (!Array.isArray(arr)) return [];
  const excludeSet = new Set(exclude.flat());
  return arr.filter((item) => !excludeSet.has(item));
}
