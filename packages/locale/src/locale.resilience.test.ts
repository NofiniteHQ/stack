import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  formatDate,
  formatCurrency,
  formatRelativeTime,
  formatNumber,
  getDirection,
} from './core';
import { LocaleProvider, useLocale } from './react';

describe('Locale Resilience & Security Remediation (M2)', () => {
  describe('RangeError Defense & Safe Fallbacks (LOCALE-M1-03)', () => {
    it('formatDate survives malformed and invalid BCP 47 locale tags', () => {
      const date = new Date('2026-11-03T12:00:00Z');
      expect(() =>
        formatDate(date, undefined, 'invalid-tag-!@#$')
      ).not.toThrow();
      const output = formatDate(date, undefined, 'invalid-tag-!@#$');
      expect(typeof output).toBe('string');
      expect(output.length).toBeGreaterThan(0);
    });

    it('formatCurrency survives invalid ISO 4217 currency codes', () => {
      expect(() => formatCurrency(150, 'NOT_A_CURRENCY')).not.toThrow();
      expect(() => formatCurrency(150, '123')).not.toThrow();
      const result = formatCurrency(150, 'INVALID');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('formatCurrency survives malformed locale tag', () => {
      expect(() =>
        formatCurrency(99.5, 'USD', undefined, 'bad-locale--tag')
      ).not.toThrow();
      const result = formatCurrency(99.5, 'USD', undefined, 'bad-locale--tag');
      expect(result).toContain('99');
    });

    it('formatRelativeTime survives malformed locale tag', () => {
      expect(() =>
        formatRelativeTime(-5, 'day', undefined, 'bad-locale--tag')
      ).not.toThrow();
      const result = formatRelativeTime(
        -5,
        'day',
        undefined,
        'bad-locale--tag'
      );
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('formatNumber survives malformed locale tag', () => {
      expect(() =>
        formatNumber(12345.67, undefined, 'bad-locale--tag')
      ).not.toThrow();
      const result = formatNumber(12345.67, undefined, 'bad-locale--tag');
      expect(result).toContain('12');
    });
  });

  describe('Bounded LRU Formatter Caching (LOCALE-M1-04)', () => {
    it('handles high volume repeated calls with cache consistency', () => {
      const date = new Date('2026-11-03T12:00:00Z');
      for (let i = 0; i < 200; i++) {
        const locale = `en-${i % 5 === 0 ? 'US' : 'GB'}`;
        const formatted = formatDate(date, { month: 'short' }, locale);
        expect(formatted).toBe('Nov');
      }
    });

    it('formats numbers efficiently across varying options', () => {
      for (let i = 0; i < 150; i++) {
        const res = formatNumber(i * 100, { notation: 'compact' }, 'en-US');
        expect(typeof res).toBe('string');
      }
    });
  });

  describe('Expanded RTL Languages & Script Subtags (LOCALE-M1-05)', () => {
    it('detects primary RTL language codes', () => {
      expect(getDirection('ar')).toBe('rtl');
      expect(getDirection('ar-EG')).toBe('rtl');
      expect(getDirection('he')).toBe('rtl');
      expect(getDirection('he-IL')).toBe('rtl');
      expect(getDirection('fa')).toBe('rtl');
      expect(getDirection('ur')).toBe('rtl');
      expect(getDirection('ps')).toBe('rtl');
      expect(getDirection('sd')).toBe('rtl');
      expect(getDirection('ug')).toBe('rtl');
      expect(getDirection('yi')).toBe('rtl');
    });

    it('detects newly added secondary RTL languages', () => {
      expect(getDirection('dv')).toBe('rtl'); // Dhivehi / Maldivian
      expect(getDirection('dv-MV')).toBe('rtl');
      expect(getDirection('ckb')).toBe('rtl'); // Central Kurdish / Sorani
      expect(getDirection('ckb-IQ')).toBe('rtl');
      expect(getDirection('ks')).toBe('rtl'); // Kashmiri
      expect(getDirection('pnb')).toBe('rtl'); // Western Punjabi
    });

    it('detects right-to-left script subtags regardless of primary language', () => {
      expect(getDirection('ku-Arab')).toBe('rtl');
      expect(getDirection('az-Arab')).toBe('rtl');
      expect(getDirection('pa-Arab')).toBe('rtl');
      expect(getDirection('syr-Syrc')).toBe('rtl');
      expect(getDirection('en-Arab')).toBe('rtl');
    });

    it('defaults to ltr for LTR locales and invalid inputs', () => {
      expect(getDirection('en')).toBe('ltr');
      expect(getDirection('en-US')).toBe('ltr');
      expect(getDirection('fr-FR')).toBe('ltr');
      expect(getDirection('zh-CN')).toBe('ltr');
      expect(getDirection('')).toBe('ltr');
      expect(getDirection(null as any)).toBe('ltr');
      expect(getDirection(undefined as any)).toBe('ltr');
    });
  });

  describe('React Integration SSR (renderToString)', () => {
    function TestConsumer() {
      const { locale, formatCurrency } = useLocale();
      return React.createElement(
        'div',
        null,
        React.createElement('span', { 'data-testid': 'loc' }, locale),
        React.createElement(
          'span',
          { 'data-testid': 'curr' },
          formatCurrency(75, 'USD')
        )
      );
    }

    it('renders inside LocaleProvider with RTL locale cleanly', () => {
      const html = renderToString(
        React.createElement(
          LocaleProvider,
          { locale: 'ar-EG' },
          React.createElement(TestConsumer)
        )
      );
      expect(html).toContain('ar-EG');
      expect(typeof html).toBe('string');
    });
  });
});
