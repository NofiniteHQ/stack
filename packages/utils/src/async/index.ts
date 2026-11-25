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
 * Returns a promise that resolves after the given duration in milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

export interface DebounceOptions {
  leading?: boolean;
  maxWait?: number;
}

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

/**
 * Creates a debounced function that delays invoking fn until after ms milliseconds have elapsed
 * since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let maxTimer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invoke = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
    if (timer) clearTimeout(timer);
    if (maxTimer) clearTimeout(maxTimer);
    timer = null;
    maxTimer = null;
  };

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;

    const callNow = options.leading && !timer;

    if (timer) clearTimeout(timer);
    timer = setTimeout(invoke, ms);

    if (options.maxWait && !maxTimer) {
      maxTimer = setTimeout(invoke, options.maxWait);
    }

    if (callNow) {
      fn(...lastArgs);
      lastArgs = null;
    }
  }) as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    if (maxTimer) clearTimeout(maxTimer);
    timer = null;
    maxTimer = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    invoke();
  };

  return debounced;
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottledFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

/**
 * Creates a throttled function that only invokes fn at most once per every ms milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;

  const invoke = () => {
    lastCallTime = leading ? Date.now() : 0;
    timer = null;
    if (trailing && lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }

    const remaining = ms - (now - lastCallTime);

    if (remaining <= 0 || remaining > ms) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn(...args);
    } else if (trailing && !timer) {
      lastArgs = args;
      timer = setTimeout(invoke, remaining);
    }
  }) as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastCallTime = 0;
  };

  return throttled;
}

export interface RetryOptions {
  retries?: number;
  delay?: number;
  backoff?: 'fixed' | 'exponential';
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Retries an asynchronous function with configurable delay and backoff strategy.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 100,
    backoff = 'exponential',
    shouldRetry = () => true,
  } = options;

  let attempt = 0;
  let currentDelay = delay;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > retries || !shouldRetry(error)) {
        throw error;
      }

      await sleep(currentDelay);
      currentDelay =
        backoff === 'exponential' ? currentDelay * 2 : currentDelay;
    }
  }

  throw new Error('Retry limit reached');
}

/**
 * Rejects with a timeout error or returns a fallback if the promise does not settle within ms milliseconds.
 */
export function timeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback?: T | Error
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (fallback instanceof Error) {
        reject(fallback);
      } else if (fallback !== undefined) {
        resolve(fallback);
      } else {
        reject(new Error(`Operation timed out after ${ms}ms`));
      }
    }, ms);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Executes a list of asynchronous task factories with a strict concurrency limit.
 */
export async function concurrencyLimit<T>(
  tasks: Array<() => Promise<T>>,
  limit: number
): Promise<T[]> {
  const actualLimit = Math.max(1, Math.min(limit, tasks.length));
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const index = nextIndex++;
      results[index] = await tasks[index]();
    }
  }

  const workers = Array.from({ length: actualLimit }, () => worker());
  await Promise.all(workers);
  return results;
}
