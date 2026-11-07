import { describe, it, expect } from 'vitest';
import { clamp, round, lerp, inRange, randomInt, randomFloat } from './index';

describe('Math Utilities', () => {
  it('clamps values within bounds', () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-5, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
    expect(clamp(3, 5, 0)).toBe(3); // reversed bounds
  });

  it('rounds numbers to precision correctly', () => {
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(1.3456, 3)).toBe(1.346);
    expect(round(1.5)).toBe(2);
    expect(round(1.4)).toBe(1);
  });

  it('performs linear interpolation with lerp()', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it('checks value range with inRange()', () => {
    expect(inRange(3, 1, 5)).toBe(true);
    expect(inRange(5, 1, 5)).toBe(false); // exclusive default
    expect(inRange(5, 1, 5, true)).toBe(true); // inclusive
    expect(inRange(0, 1, 5)).toBe(false);
  });

  it('generates random integers within bounds', () => {
    for (let i = 0; i < 50; i++) {
      const n = randomInt(5, 10);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('generates random floats within bounds', () => {
    for (let i = 0; i < 50; i++) {
      const f = randomFloat(1.5, 3.5);
      expect(f).toBeGreaterThanOrEqual(1.5);
      expect(f).toBeLessThan(3.5);
    }
  });
});
