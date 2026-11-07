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
  it('chunks array into groups of specified size', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 2)).toEqual([]);
    expect(chunk([1, 2], 0)).toEqual([]);
  });

  it('filters duplicate elements with unique()', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);

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

  it('groups array elements by key', () => {
    const items = [
      { category: 'fruit', name: 'apple' },
      { category: 'vegetable', name: 'carrot' },
      { category: 'fruit', name: 'banana' },
    ];
    const grouped = groupBy(items, (i) => i.category);

    expect(grouped.fruit).toHaveLength(2);
    expect(grouped.vegetable).toHaveLength(1);
  });

  it('indexes array elements with keyBy()', () => {
    const items = [
      { id: 'a', val: 1 },
      { id: 'b', val: 2 },
    ];
    expect(keyBy(items, (i) => i.id)).toEqual({
      a: { id: 'a', val: 1 },
      b: { id: 'b', val: 2 },
    });
  });

  it('shuffles arrays without mutating original', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffle(original);

    expect(shuffled).toHaveLength(10);
    expect(shuffled.sort((a, b) => a - b)).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('samples random elements', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(sample(arr));
    expect(sample([])).toBeUndefined();

    const sampleGroup = sampleSize(arr, 2);
    expect(sampleGroup).toHaveLength(2);
  });

  it('calculates intersection between multiple arrays', () => {
    expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
    expect(intersection([1, 2])).toEqual([1, 2]);
    expect(intersection()).toEqual([]);
  });

  it('calculates difference between arrays', () => {
    expect(difference([1, 2, 3, 4], [2, 3])).toEqual([1, 4]);
    expect(difference([1, 2], [1], [2])).toEqual([]);
  });
});
