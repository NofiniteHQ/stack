import { describe, it, expect } from 'vitest';
import { getDirection } from '../src/core';

describe('getDirection API', () => {
  describe('Standard LTR Locales', () => {
    it.each([
      ['en'],
      ['en-US'],
      ['en-GB'],
      ['fr'],
      ['fr-FR'],
      ['de'],
      ['de-DE'],
      ['es'],
      ['es-ES'],
      ['it'],
      ['pt-BR'],
      ['ru'],
      ['ja'],
      ['ja-JP'],
      ['ko'],
      ['zh-CN'],
      ['zh-TW'],
      ['hi-IN'],
    ])('identifies %s as ltr', (locale) => {
      expect(getDirection(locale)).toBe('ltr');
    });
  });

  describe('Standard RTL Locales', () => {
    it.each([
      ['ar', 'Arabic base'],
      ['ar-EG', 'Arabic Egypt'],
      ['ar-SA', 'Arabic Saudi Arabia'],
      ['he', 'Hebrew base'],
      ['he-IL', 'Hebrew Israel'],
      ['fa', 'Persian base'],
      ['fa-IR', 'Persian Iran'],
      ['ur', 'Urdu base'],
      ['ur-PK', 'Urdu Pakistan'],
      ['ps', 'Pashto base'],
      ['ps-AF', 'Pashto Afghanistan'],
      ['sd', 'Sindhi base'],
      ['sd-PK', 'Sindhi Pakistan'],
      ['ug', 'Uyghur base'],
      ['ug-CN', 'Uyghur China'],
      ['yi', 'Yiddish base'],
    ])('identifies %s (%s) as rtl', (locale) => {
      expect(getDirection(locale)).toBe('rtl');
    });

    it('handles uppercase and mixed-case tags', () => {
      expect(getDirection('AR')).toBe('rtl');
      expect(getDirection('AR-eg')).toBe('rtl');
      expect(getDirection('HE-il')).toBe('rtl');
      expect(getDirection('fa_IR')).toBe('rtl');
    });
  });

  describe('Edge Cases & Invalid Inputs', () => {
    it('returns ltr for empty string', () => {
      expect(getDirection('')).toBe('ltr');
    });

    it('returns ltr for whitespace-only strings', () => {
      expect(getDirection('   ')).toBe('ltr');
      expect(getDirection('\t\n')).toBe('ltr');
    });

    it('returns ltr for null or undefined or non-string inputs', () => {
      expect(getDirection(null as unknown as string)).toBe('ltr');
      expect(getDirection(undefined as unknown as string)).toBe('ltr');
      expect(getDirection(123 as unknown as string)).toBe('ltr');
      expect(getDirection({} as unknown as string)).toBe('ltr');
    });

    it('returns ltr for unknown or invalid locales', () => {
      expect(getDirection('xyz-unknown')).toBe('ltr');
      expect(getDirection('12345')).toBe('ltr');
    });
  });

  describe('Fallback Handling when Intl.Locale throws or lacks textInfo', () => {
    it('falls back to RTL language set when Intl.Locale constructor throws on malformed tag', () => {
      // Tags with invalid structure that trigger Intl.Locale parse exceptions
      expect(getDirection('ar-@invalid!')).toBe('rtl');
      expect(getDirection('he-@invalid!')).toBe('rtl');
      expect(getDirection('en-@invalid!')).toBe('ltr');
    });

    it('falls back correctly when textInfo is missing from Intl.Locale', () => {
      const originalLocale = Intl.Locale;
      try {
        // Mock Intl.Locale where textInfo is undefined
        (Intl as any).Locale = function (tag: string) {
          return {
            baseName: tag,
            language: tag.split('-')[0],
            textInfo: undefined,
            getTextInfo: undefined,
          };
        };

        expect(getDirection('ar')).toBe('rtl');
        expect(getDirection('ar-EG')).toBe('rtl');
        expect(getDirection('he')).toBe('rtl');
        expect(getDirection('fa')).toBe('rtl');
        expect(getDirection('ur')).toBe('rtl');
        expect(getDirection('ps')).toBe('rtl');
        expect(getDirection('sd')).toBe('rtl');
        expect(getDirection('ug')).toBe('rtl');
        expect(getDirection('yi')).toBe('rtl');
        expect(getDirection('en-US')).toBe('ltr');
        expect(getDirection('fr')).toBe('ltr');
      } finally {
        (Intl as any).Locale = originalLocale;
      }
    });

    it('falls back correctly when Intl.Locale is completely undefined', () => {
      const originalLocale = Intl.Locale;
      try {
        delete (Intl as any).Locale;

        expect(getDirection('ar')).toBe('rtl');
        expect(getDirection('he')).toBe('rtl');
        expect(getDirection('fa')).toBe('rtl');
        expect(getDirection('ur')).toBe('rtl');
        expect(getDirection('ps')).toBe('rtl');
        expect(getDirection('sd')).toBe('rtl');
        expect(getDirection('ug')).toBe('rtl');
        expect(getDirection('yi')).toBe('rtl');
        expect(getDirection('en')).toBe('ltr');
      } finally {
        (Intl as any).Locale = originalLocale;
      }
    });
  });
});
