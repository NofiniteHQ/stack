import { describe, it, expect } from 'vitest';
import {
  isEmail,
  isUrl,
  isUuid,
  isNil,
  isEmpty,
  isObject,
  isPlainObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
} from './index';

describe('Validation Utilities', () => {
  it('validates email addresses', () => {
    expect(isEmail('dev@nofinite.com')).toBe(true);
    expect(isEmail('test.user+tag@domain.co.uk')).toBe(true);
    expect(isEmail('plainaddress')).toBe(false);
    expect(isEmail('@missinguser.com')).toBe(false);
    expect(isEmail('')).toBe(false);
  });

  it('validates URLs', () => {
    expect(isUrl('https://nofinite.com')).toBe(true);
    expect(isUrl('http://localhost:3000')).toBe(true);
    expect(isUrl('ftp://files.example.com')).toBe(true);
    expect(isUrl('javascript:alert(1)')).toBe(false);
    expect(isUrl('not-a-url')).toBe(false);
  });

  it('validates UUIDs', () => {
    const v4 = '018f3d96-700a-446b-8b80-985d9a02f0de';
    const v7 = '018f3d96-700a-746b-8b80-985d9a02f0de';

    expect(isUuid(v4)).toBe(true);
    expect(isUuid(v4, 4)).toBe(true);
    expect(isUuid(v4, 7)).toBe(false);

    expect(isUuid(v7)).toBe(true);
    expect(isUuid(v7, 7)).toBe(true);
    expect(isUuid(v7, 4)).toBe(false);

    expect(isUuid('not-a-uuid')).toBe(false);
  });

  it('checks isNil()', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil(false)).toBe(false);
  });

  it('checks isEmpty()', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);

    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('checks type guards: isObject, isPlainObject, isArray, isString, isNumber, isBoolean', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(null)).toBe(false);

    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject([])).toBe(false);

    expect(isArray([1, 2])).toBe(true);
    expect(isArray('abc')).toBe(false);

    expect(isString('hello')).toBe(true);
    expect(isString(123)).toBe(false);

    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);

    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(0)).toBe(false);
  });
});
