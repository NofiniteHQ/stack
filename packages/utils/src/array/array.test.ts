import { describe, it, expect } from 'vitest';
import {
  chunk,
  unique,
  groupBy,
  keyBy,
  shuffle,
  sample,
  sampleSize,
  intersection,
  difference,
} from './index';

describe('Array Utilities', () => {
  describe('chunk', () => {
    it('chunks array into groups of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('returns empty array when input is empty or size <= 0', () => {
      expect(chunk([], 2)).toEqual([]);
      expect(chunk([1, 2], 0)).toEqual([]);
      expect(chunk([1, 2], -1)).toEqual([]);
    });

    it('returns single chunk if chunk size exceeds array length', () => {
      expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
    });
  });

  describe('unique', () => {
    it('filters primitive duplicates preserving first occurrence order', () => {
      expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      expect(unique([])).toEqual([]);
    });

    it('filters objects by custom key selector', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Copy' },
      ];
      expect(unique(users, (u) => u.id)).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });
  });

  describe('groupBy', () => {
    it('groups array elements by key function', () => {
      const items = [
        { category: 'fruit', name: 'apple' },
        { category: 'vegetable', name: 'carrot' },
        { category: 'fruit', name: 'banana' },
      ];
      const grouped = groupBy(items, (i) => i.category);

      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });

    it('handles empty arrays cleanly', () => {
      expect(groupBy([], (x: unknown) => String(x))).toEqual({});
    });
  });

  describe('keyBy', () => {
    it('indexes array elements by unique selector', () => {
      const items = [
        { id: 'a', val: 1 },
        { id: 'b', val: 2 },
      ];
      expect(keyBy(items, (i) => i.id)).toEqual({
        a: { id: 'a', val: 1 },
        b: { id: 'b', val: 2 },
      });
    });

    it('later elements overwrite earlier elements with identical keys', () => {
      const items = [
        { code: 'X', version: 1 },
        { code: 'X', version: 2 },
      ];
      expect(keyBy(items, (i) => i.code)).toEqual({
        X: { code: 'X', version: 2 },
      });
    });
  });

  describe('shuffle', () => {
    it('shuffles arrays without mutating original array', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = shuffle(original);

      expect(shuffled).toHaveLength(10);
      expect(shuffled.sort((a, b) => a - b)).toEqual(original);
      expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('handles empty and single-element arrays', () => {
      expect(shuffle([])).toEqual([]);
      expect(shuffle([42])).toEqual([42]);
    });
  });

  describe('sample & sampleSize', () => {
    it('sample returns a random element or undefined for empty array', () => {
      const arr = [10, 20, 30];
      expect(arr).toContain(sample(arr));
      expect(sample([])).toBeUndefined();
    });

    it('sampleSize returns specified count of random items', () => {
      const arr = [1, 2, 3, 4, 5];
      const samples = sampleSize(arr, 3);
      expect(samples).toHaveLength(3);
      for (const item of samples) {
        expect(arr).toContain(item);
      }
    });

    it('sampleSize returns all items when n >= array length', () => {
      const arr = [1, 2];
      const samples = sampleSize(arr, 5);
      expect(samples).toHaveLength(2);
      expect(samples.sort()).toEqual([1, 2]);
    });

    it('sampleSize returns empty array when n <= 0', () => {
      expect(sampleSize([1, 2, 3], 0)).toEqual([]);
      expect(sampleSize([1, 2, 3], -2)).toEqual([]);
    });
  });

  describe('intersection & difference', () => {
    it('calculates intersection between multiple arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
      expect(intersection([1, 2])).toEqual([1, 2]);
      expect(intersection()).toEqual([]);
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it('calculates difference between arrays', () => {
      expect(difference([1, 2, 3, 4], [2, 3])).toEqual([1, 4]);
      expect(difference([1, 2], [1], [2])).toEqual([]);
      expect(difference([1, 2], [])).toEqual([1, 2]);
    });
  });
});
