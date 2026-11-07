import { describe, it, expect, vi } from 'vitest';
import {
  sleep,
  debounce,
  throttle,
  retry,
  timeout,
  concurrencyLimit,
} from './index';

describe('Async Utilities', () => {
  it('sleeps for specified duration', async () => {
    const start = Date.now();
    await sleep(20);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });

  it('debounces invocations', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced(1);
    debounced(2);
    debounced(3);

    expect(fn).not.toHaveBeenCalled();

    await sleep(70);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('supports debounced.cancel() and debounced.flush()', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced('cancel-test');
    debounced.cancel();

    await sleep(70);
    expect(fn).not.toHaveBeenCalled();

    debounced('flush-test');
    debounced.flush();
    expect(fn).toHaveBeenCalledWith('flush-test');
  });

  it('throttles invocations', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 50);

    throttled(1);
    throttled(2);
    throttled(3);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    await sleep(70);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries failing promises up to limit', async () => {
    let attempts = 0;
    const task = async () => {
      attempts++;
      if (attempts < 3) throw new Error('Temporary failure');
      return 'success';
    };

    const result = await retry(task, {
      retries: 3,
      delay: 10,
      backoff: 'fixed',
    });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('times out long-running promises', async () => {
    const slow = new Promise((resolve) => setTimeout(resolve, 100));

    await expect(timeout(slow, 20)).rejects.toThrow(/timed out/);
    const fallback = await timeout(slow, 20, 'fallback-value');
    expect(fallback).toBe('fallback-value');
  });

  it('limits concurrency among async tasks', async () => {
    let running = 0;
    let maxRunning = 0;

    const makeTask = (id: number) => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await sleep(20);
      running--;
      return id;
    };

    const tasks = [makeTask(1), makeTask(2), makeTask(3), makeTask(4)];
    const results = await concurrencyLimit(tasks, 2);

    expect(results).toEqual([1, 2, 3, 4]);
    expect(maxRunning).toBeLessThanOrEqual(2);
  });
});
