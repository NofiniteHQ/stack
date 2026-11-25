import { describe, it, expect } from 'vitest';
import {
  capitalize,
  camelCase,
  pascalCase,
  kebabCase,
  snakeCase,
  slugify,
  truncate,
  escapeHtml,
  unescapeHtml,
  stripTags,
  sanitizeUrl,
} from './index';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('capitalizes the first letter of strings', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('')).toBe('');
      expect(capitalize('a')).toBe('A');
      expect(capitalize('already Capital')).toBe('Already Capital');
    });
  });

  describe('casing conversions (camelCase, pascalCase, kebabCase, snakeCase)', () => {
    it('converts to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('hello-world_test')).toBe('helloWorldTest');
      expect(camelCase('FooBarBaz')).toBe('fooBarBaz');
      expect(camelCase('')).toBe('');
    });

    it('converts to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('foo-bar')).toBe('FooBar');
      expect(pascalCase('user_profile_id')).toBe('UserProfileId');
    });

    it('converts to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('User Profile ID')).toBe('user-profile-id');
      expect(kebabCase('snake_case_string')).toBe('snake-case-string');
    });

    it('converts to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('User Profile ID')).toBe('user_profile_id');
      expect(snakeCase('kebab-case-string')).toBe('kebab_case_string');
    });
  });

  describe('slugify', () => {
    it('generates clean URL slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Crème Brûlée & Café')).toBe('creme-brulee-cafe');
      expect(slugify('---Multiple---Dashes---')).toBe('multiple-dashes');
      expect(slugify('Custom Underscore', { replacement: '_' })).toBe(
        'custom_underscore'
      );
      expect(slugify('')).toBe('');
    });

    it('supports lowercase=false option', () => {
      expect(slugify('Hello World', { lower: false })).toBe('Hello-World');
    });
  });

  describe('truncate', () => {
    it('truncates strings safely with default ellipsis', () => {
      expect(truncate('Hello, World!', 5)).toBe('Hello...');
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('Exact', 5)).toBe('Exact');
    });

    it('supports custom omission string and edge lengths', () => {
      expect(truncate('Custom Suffix', 6, ' [more]')).toBe('Custom [more]');
      expect(truncate('', 5)).toBe('');
      expect(truncate('Hello', 0)).toBe('');
    });
  });

  describe('escapeHtml & unescapeHtml', () => {
    it('escapes and unescapes HTML entities', () => {
      const raw = '<script>alert("XSS & fun\'s")</script>';
      const escaped = escapeHtml(raw);
      expect(escaped).toBe(
        '&lt;script&gt;alert(&quot;XSS &amp; fun&#39;s&quot;)&lt;/script&gt;'
      );
      expect(unescapeHtml(escaped)).toBe(raw);
    });

    it('handles strings with no special entities', () => {
      expect(escapeHtml('plain text')).toBe('plain text');
      expect(unescapeHtml('plain text')).toBe('plain text');
      expect(escapeHtml('')).toBe('');
      expect(unescapeHtml('')).toBe('');
    });
  });

  describe('stripTags', () => {
    it('strips all HTML and XML tags from strings', () => {
      expect(stripTags('<p>Hello <strong>World</strong>!</p>')).toBe(
        'Hello World!'
      );
      expect(stripTags('<a href="https://example.com">Link</a>')).toBe('Link');
      expect(stripTags('No tags here')).toBe('No tags here');
      expect(stripTags('<scr<script>ipt>alert(1)</script>')).toBe('alert(1)');
      expect(stripTags('')).toBe('');
    });
  });

  describe('sanitizeUrl', () => {
    it('preserves safe URLs and paths', () => {
      expect(sanitizeUrl('https://nofinite.com/docs')).toBe(
        'https://nofinite.com/docs'
      );
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
      expect(sanitizeUrl('/relative/path')).toBe('/relative/path');
      expect(sanitizeUrl('mailto:test@nofinite.com')).toBe(
        'mailto:test@nofinite.com'
      );
      expect(sanitizeUrl('tel:+1234567890')).toBe('tel:+1234567890');
    });

    it('neutralizes dangerous schemes into about:blank', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('about:blank');
      expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('about:blank');
      expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('about:blank');
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe(
        'about:blank'
      );
      expect(sanitizeUrl('   javascript:void(0)   ')).toBe('about:blank');
      expect(sanitizeUrl('')).toBe('');
    });
  });
});
