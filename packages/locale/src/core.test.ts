import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  getCountryByCode,
  getCountryByDialCode,
  getCountryMetadata,
  formatDate,
  formatCurrency,
  formatRelativeTime,
  formatNumber,
} from './core';
import { LocaleProvider, useLocale } from './react';

describe('Locale Core Logic & Native Intl Engine', () => {
  describe('Country Lookups', () => {
    it('should find a country by uppercase ISO (US)', () => {
      const country = getCountryByCode('US');
      expect(country).toBeDefined();
      expect(country?.name).toBe('United States');
    });

    it('should find a country by lowercase ISO (in)', () => {
      const country = getCountryByCode('in');
      expect(country).toBeDefined();
      expect(country?.name).toBe('India');
    });

    it('should return undefined for invalid codes', () => {
      const country = getCountryByCode('XX');
      expect(country).toBeUndefined();
    });

    it('should retrieve country metadata through getCountryMetadata alias', () => {
      const country = getCountryMetadata('GB');
      expect(country).toBeDefined();
      expect(country?.name).toBe('United Kingdom');
      expect(country?.dialCode).toBe('+44');
    });

    it('should find a country by dial code with plus (+91)', () => {
      const country = getCountryByDialCode('+91');
      expect(country?.iso2).toBe('IN');
    });

    it('should find a country by dial code without plus (1)', () => {
      const country = getCountryByDialCode('1');
      expect(country?.iso2).toBe('CA');
    });

    it('should return undefined for non-existent codes', () => {
      const country = getCountryByDialCode('99999');
      expect(country).toBeUndefined();
    });
  });

  describe('formatDate', () => {
    it('formats Date object in default en-US locale', () => {
      const d = new Date(2026, 9, 30); // Oct 30, 2026
      const formatted = formatDate(d);
      expect(formatted).toBe('Oct 30, 2026');
    });

    it('formats ISO string date', () => {
      const formatted = formatDate('2026-10-30T12:00:00Z', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
      expect(formatted).toBe('October 30, 2026');
    });

    it('formats numeric timestamp', () => {
      const timestamp = Date.UTC(2026, 9, 30);
      const formatted = formatDate(timestamp, {
        year: 'numeric',
        timeZone: 'UTC',
      });
      expect(formatted).toBe('2026');
    });

    it('formats with alternate locale (fr-FR)', () => {
      const d = new Date(2026, 9, 30);
      const formatted = formatDate(
        d,
        { month: 'long', year: 'numeric' },
        'fr-FR'
      );
      expect(formatted.toLowerCase()).toContain('octobre');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDate('not-a-date')).toBe('');
      expect(formatDate(NaN)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD currency correctly in en-US', () => {
      const formatted = formatCurrency(1234.56, 'USD');
      expect(formatted).toBe('$1,234.56');
    });

    it('formats EUR currency correctly in de-DE', () => {
      const formatted = formatCurrency(1234.56, 'EUR', undefined, 'de-DE');
      // German formatting uses non-breaking space and comma: 1.234,56 €
      expect(formatted).toMatch(/1\.234,56\s*€/);
    });

    it('formats zero-decimal currencies (JPY)', () => {
      const formatted = formatCurrency(5000, 'JPY', undefined, 'ja-JP');
      expect(formatted).toMatch(/￥\s*5,000/);
    });
  });

  describe('formatRelativeTime', () => {
    it('formats past days in en-US', () => {
      const formatted = formatRelativeTime(-1, 'day');
      expect(formatted).toBe('yesterday');
    });

    it('formats future days in en-US', () => {
      const formatted = formatRelativeTime(1, 'day');
      expect(formatted).toBe('tomorrow');
    });

    it('formats hours with numeric auto', () => {
      const formatted = formatRelativeTime(-3, 'hour');
      expect(formatted).toBe('3 hours ago');
    });

    it('formats in alternate locale (es-ES)', () => {
      const formatted = formatRelativeTime(-1, 'day', undefined, 'es-ES');
      expect(formatted).toBe('ayer');
    });
  });

  describe('formatNumber', () => {
    it('formats standard decimal numbers with group separators', () => {
      const formatted = formatNumber(1000000);
      expect(formatted).toBe('1,000,000');
    });

    it('formats percent notation', () => {
      const formatted = formatNumber(0.42, { style: 'percent' });
      expect(formatted).toBe('42%');
    });

    it('formats compact notation', () => {
      const formatted = formatNumber(1500000, { notation: 'compact' });
      expect(formatted).toBe('1.5M');
    });
  });

  describe('React LocaleProvider & useLocale', () => {
    const TestConsumer: React.FC = () => {
      const { locale, formatCurrency: fc, formatDate: fd } = useLocale();
      const date = new Date(2026, 9, 30);
      return React.createElement(
        'div',
        null,
        React.createElement('span', { 'data-testid': 'locale' }, locale),
        React.createElement('span', { 'data-testid': 'price' }, fc(99, 'USD')),
        React.createElement('span', { 'data-testid': 'date' }, fd(date))
      );
    };

    it('provides configured locale to nested components', () => {
      const html = renderToString(
        React.createElement(
          LocaleProvider,
          { locale: 'en-US' },
          React.createElement(TestConsumer)
        )
      );
      expect(html).toContain('en-US');
      expect(html).toContain('$99.00');
      expect(html).toContain('Oct 30, 2026');
    });

    it('provides internationalized formatting when locale is switched', () => {
      const html = renderToString(
        React.createElement(
          LocaleProvider,
          { locale: 'de-DE' },
          React.createElement(TestConsumer)
        )
      );
      expect(html).toContain('de-DE');
      expect(html).toMatch(/99,00\s*\$/);
    });

    it('falls back gracefully when rendered outside of LocaleProvider', () => {
      const html = renderToString(React.createElement(TestConsumer));
      expect(html).toContain('$99.00');
    });
  });
});
