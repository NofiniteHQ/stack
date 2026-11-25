import { describe, it, expect } from 'vitest';
import {
  deepClone,
  deepMerge,
  pick,
  omit,
  get,
  set,
  has,
  isEqual,
} from './index';

describe('Object Utilities', () => {
  it('deeply clones objects, arrays, and nested structures', () => {
    const original = { a: 1, b: { c: [2, 3] }, d: new Date(1000) };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b.c).not.toBe(original.b.c);
    expect(cloned.d.getTime()).toBe(1000);
  });

  it('deeply merges objects without mutating the target', () => {
    const target = { a: 1, b: { x: 10, y: 20 } };
    const source = { b: { y: 99, z: 30 }, c: 3 };

    const merged = deepMerge(target, source);

    expect(merged).toEqual({ a: 1, b: { x: 10, y: 99, z: 30 }, c: 3 });
    expect(target.b.y).toBe(20); // target untouched
  });

  it('picks specified properties', () => {
    const obj = { id: 1, name: 'Alice', role: 'admin', age: 30 };
    expect(pick(obj, ['id', 'name'])).toEqual({ id: 1, name: 'Alice' });
    expect(pick(obj, [])).toEqual({});
  });

  it('omits specified properties', () => {
    const obj = { id: 1, name: 'Alice', password: 'secret', role: 'admin' };
    expect(omit(obj, ['password', 'role'])).toEqual({ id: 1, name: 'Alice' });
  });

  it('retrieves nested properties with get()', () => {
    const data = { user: { profile: { tags: ['admin', 'dev'] } } };
    expect(get(data, 'user.profile.tags[0]')).toBe('admin');
    expect(get(data, 'user.profile.tags[1]')).toBe('dev');
    expect(get(data, 'user.missing.prop', 'default')).toBe('default');
    expect(get(null, 'foo', 'fallback')).toBe('fallback');
  });

  it('sets nested properties with set()', () => {
    const target: Record<string, unknown> = {};
    set(target, 'user.profile.name', 'Bob');
    expect(get(target, 'user.profile.name')).toBe('Bob');

    set(target, 'items[0].id', 123);
    expect(get(target, 'items[0].id')).toBe(123);
  });

  it('checks path existence with has()', () => {
    const data = { a: { b: 0, c: null, d: undefined } };
    expect(has(data, 'a.b')).toBe(true);
    expect(has(data, 'a.c')).toBe(true);
    expect(has(data, 'a.d')).toBe(true);
    expect(has(data, 'a.nonexistent')).toBe(false);
  });

  it('compares deep equality with isEqual()', () => {
    expect(isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual(new Date(100), new Date(100))).toBe(true);
    expect(isEqual(new Date(100), new Date(200))).toBe(false);
    expect(isEqual(/abc/g, /abc/g)).toBe(true);
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
  });

  it('blocks prototype pollution keys in set() and deepMerge()', () => {
    const target: Record<string, unknown> = {};
    set(target, '__proto__.polluted', true);
    set(target, 'constructor.prototype.polluted', true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();

    const payload = JSON.parse('{"__proto__":{"polluted2":true},"safe":1}');
    const merged = deepMerge({ safe: 0 }, payload) as Record<string, unknown>;
    expect(merged.safe).toBe(1);
    expect(({} as Record<string, unknown>).polluted2).toBeUndefined();
  });
});
