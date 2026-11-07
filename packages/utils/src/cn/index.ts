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

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, unknown>
  | ClassValue[];

function toVal(mix: ClassValue): string {
  let str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k]);
          if (y) {
            if (str) str += ' ';
            str += y;
          }
        }
      }
    } else if (mix !== null) {
      for (const k in mix) {
        if (mix[k]) {
          if (str) str += ' ';
          str += k;
        }
      }
    }
  }

  return str;
}

/**
 * Universal, high-performance utility for conditionally joining CSS class names together.
 * Zero-dependency replacement for clsx / classnames across the entire Nofinite ecosystem.
 */
export function cn(...inputs: ClassValue[]): string {
  let i = 0;
  let tmp: ClassValue;
  let str = '';
  while (i < inputs.length) {
    tmp = inputs[i++];
    if (tmp) {
      const x = toVal(tmp);
      if (x) {
        if (str) str += ' ';
        str += x;
      }
    }
  }
  return str;
}
