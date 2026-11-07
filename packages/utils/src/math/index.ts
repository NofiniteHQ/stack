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
 * Clamps a number within the inclusive lower and upper bounds.
 */
export function clamp(val: number, min: number, max: number): number {
  if (isNaN(val)) return min;
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(Math.max(val, lower), upper);
}

/**
 * Rounds a number to a specified number of decimal places without floating point anomalies.
 */
export function round(val: number, decimals = 0): number {
  if (isNaN(val)) return NaN;
  if (decimals <= 0) return Math.round(val);
  const factor = 10 ** decimals;
  return Math.round((val + Number.EPSILON) * factor) / factor;
}

/**
 * Performs linear interpolation between two values.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Checks if a value is within the given range (inclusive of min, exclusive of max by default).
 */
export function inRange(
  val: number,
  min: number,
  max: number,
  inclusive = false
): boolean {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return inclusive ? val >= lower && val <= upper : val >= lower && val < upper;
}

/**
 * Generates a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

/**
 * Generates a random floating-point number between min and max.
 */
export function randomFloat(min: number, max: number): number {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.random() * (upper - lower) + lower;
}
