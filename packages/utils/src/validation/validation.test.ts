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
  describe('isEmail', () => {
    it('validates standard email addresses', () => {
      expect(isEmail('dev@nofinite.com')).toBe(true);
      expect(isEmail('test.user+tag@domain.co.uk')).toBe(true);
      expect(isEmail('customer_support@domain.org')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isEmail('plainaddress')).toBe(false);
      expect(isEmail('@missinguser.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail('user@domain')).toBe(false);
      expect(isEmail('user@.com')).toBe(false);
      expect(isEmail('user space@domain.com')).toBe(false);
      expect(isEmail('')).toBe(false);
      expect(isEmail(null as unknown as string)).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('validates standard HTTP and HTTPS URLs', () => {
      expect(isUrl('https://nofinite.com')).toBe(true);
      expect(isUrl('http://localhost:3000/api/v1?query=1#hash')).toBe(true);
      expect(isUrl('https://sub.domain.co.uk/path/file.html')).toBe(true);
      expect(isUrl('ftp://files.example.com')).toBe(true);
    });

    it('rejects non-HTTP protocols and invalid URLs', () => {
      expect(isUrl('javascript:alert(1)')).toBe(false);
      expect(isUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isUrl('relative/path')).toBe(false);
      expect(isUrl('/root/relative')).toBe(false);
      expect(isUrl('')).toBe(false);
      expect(isUrl(null as unknown as string)).toBe(false);
    });
  });

  describe('isUuid', () => {
    const v4 = '018f3d96-700a-446b-8b80-985d9a02f0de';
    const v7 = '018f3d96-700a-746b-8b80-985d9a02f0de';

    it('validates generic UUID format without version constraint', () => {
      expect(isUuid(v4)).toBe(true);
      expect(isUuid(v7)).toBe(true);
    });

    it('validates version-specific UUIDs (v4 vs v7)', () => {
      expect(isUuid(v4, 4)).toBe(true);
      expect(isUuid(v4, 7)).toBe(false);

      expect(isUuid(v7, 7)).toBe(true);
      expect(isUuid(v7, 4)).toBe(false);
    });

    it('rejects malformed UUIDs', () => {
      expect(isUuid('not-a-uuid')).toBe(false);
      expect(isUuid('018f3d96700a446b8b80985d9a02f0de')).toBe(false); // missing dashes
      expect(isUuid('018f3d96-700a-446b-8b80-985d9a02f0dZ')).toBe(false); // invalid hex
      expect(isUuid('')).toBe(false);
      expect(isUuid(null as unknown as string)).toBe(false);
    });
  });

  describe('isNil', () => {
    it('returns true only for null and undefined', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
      expect(isNil(0)).toBe(false);
      expect(isNil('')).toBe(false);
      expect(isNil(false)).toBe(false);
      expect(isNil(NaN)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('detects empty collections, strings, and nil', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Set())).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('detects non-empty collections and strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      const map = new Map();
      map.set('k', 'v');
      expect(isEmpty(map)).toBe(false);
      const set = new Set();
      set.add(1);
      expect(isEmpty(set)).toBe(false);
    });
  });

  describe('Type Guards', () => {
    it('isObject checks for non-null objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
      expect(isObject(new Date())).toBe(true);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
    });

    it('isPlainObject checks for literal or Object.create(null) objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ key: 'val' })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(new (class Test {})())).toBe(false);
    });

    it('isArray checks for native arrays', () => {
      expect(isArray([1, 2])).toBe(true);
      expect(isArray([])).toBe(true);
      expect(isArray('abc')).toBe(false);
      expect(isArray({ length: 0 })).toBe(false);
    });

    it('isString checks for string primitives', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
    });

    it('isNumber checks for finite numeric primitives', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-45.67)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
      expect(isNumber('123')).toBe(false);
    });

    it('isBoolean checks for boolean primitives', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
    });
  });
});
