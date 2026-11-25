import { describe, it, expect } from 'vitest';
import { clamp, round, lerp, inRange, randomInt, randomFloat } from './index';

describe('Math Utilities', () => {
  describe('clamp', () => {
    it('clamps values above max and below min', () => {
      expect(clamp(10, 0, 5)).toBe(5);
      expect(clamp(-5, 0, 5)).toBe(0);
      expect(clamp(3, 0, 5)).toBe(3);
    });

    it('handles reversed bounds automatically', () => {
      expect(clamp(3, 5, 0)).toBe(3);
      expect(clamp(10, 5, 0)).toBe(5);
      expect(clamp(-5, 5, 0)).toBe(0);
    });

    it('handles negative bounds and identical min/max', () => {
      expect(clamp(-15, -10, -5)).toBe(-10);
      expect(clamp(-3, -10, -5)).toBe(-5);
      expect(clamp(-7, -10, -5)).toBe(-7);
      expect(clamp(42, 10, 10)).toBe(10);
    });
  });

  describe('round', () => {
    it('rounds numbers to specified decimal places', () => {
      expect(round(1.005, 2)).toBe(1.01);
      expect(round(1.3456, 3)).toBe(1.346);
      expect(round(123.456, 0)).toBe(123);
    });

    it('defaults to 0 decimal places when precision is omitted', () => {
      expect(round(1.5)).toBe(2);
      expect(round(1.4)).toBe(1);
      expect(round(-1.5)).toBe(-1);
    });

    it('handles floating point arithmetic quirks cleanly', () => {
      expect(round(0.1 + 0.2, 1)).toBe(0.3);
      expect(round(0.28 * 100, 0)).toBe(28);
    });
  });

  describe('lerp', () => {
    it('performs linear interpolation across [0, 1] factor', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(10, 20, 0)).toBe(10);
      expect(lerp(10, 20, 1)).toBe(20);
      expect(lerp(0, 100, 0.25)).toBe(25);
    });

    it('handles negative ranges and negative factors (extrapolation)', () => {
      expect(lerp(-100, 100, 0.5)).toBe(0);
      expect(lerp(0, 10, -0.5)).toBe(-5);
      expect(lerp(0, 10, 1.5)).toBe(15);
    });
  });

  describe('inRange', () => {
    it('checks range with default exclusive upper bound', () => {
      expect(inRange(3, 1, 5)).toBe(true);
      expect(inRange(1, 1, 5)).toBe(true);
      expect(inRange(5, 1, 5)).toBe(false);
      expect(inRange(0, 1, 5)).toBe(false);
      expect(inRange(6, 1, 5)).toBe(false);
    });

    it('checks range with inclusive upper bound', () => {
      expect(inRange(5, 1, 5, true)).toBe(true);
      expect(inRange(1, 1, 5, true)).toBe(true);
      expect(inRange(5.001, 1, 5, true)).toBe(false);
    });

    it('handles reversed bounds automatically', () => {
      expect(inRange(3, 5, 1)).toBe(true);
      expect(inRange(0, 5, 1)).toBe(false);
    });
  });

  describe('randomInt', () => {
    it('generates random integers within bounds', () => {
      for (let i = 0; i < 50; i++) {
        const n = randomInt(5, 10);
        expect(n).toBeGreaterThanOrEqual(5);
        expect(n).toBeLessThanOrEqual(10);
        expect(Number.isInteger(n)).toBe(true);
      }
    });

    it('returns exact value when min equals max', () => {
      expect(randomInt(7, 7)).toBe(7);
    });
  });

  describe('randomFloat', () => {
    it('generates random floats within bounds', () => {
      for (let i = 0; i < 50; i++) {
        const f = randomFloat(1.5, 3.5);
        expect(f).toBeGreaterThanOrEqual(1.5);
        expect(f).toBeLessThan(3.5);
      }
    });
  });
});
