import { describe, it, expect } from 'vitest';
import { parseLocale, matchLocale, getDirection } from './index';

describe('BCP 47 Locale Parsing & Matching', () => {
  describe('parseLocale', () => {
    it('parses language-only tags', () => {
      const en = parseLocale('en');
      expect(en.language).toBe('en');
      expect(en.direction).toBe('ltr');
      expect(en.script).toBeUndefined();

      const ar = parseLocale('ar');
      expect(ar.language).toBe('ar');
      expect(ar.direction).toBe('rtl');
    });

    it('parses language-region tags', () => {
      const enUs = parseLocale('en-US');
      expect(enUs.language).toBe('en');
      expect(enUs.region).toBe('US');
      expect(enUs.direction).toBe('ltr');

      const ptBr = parseLocale('pt-BR');
      expect(ptBr.language).toBe('pt');
      expect(ptBr.region).toBe('BR');
    });

    it('parses language-script tags', () => {
      const srCyrl = parseLocale('sr-Cyrl');
      expect(srCyrl.language).toBe('sr');
      expect(srCyrl.script).toBe('Cyrl');
      expect(srCyrl.direction).toBe('ltr');

      const srLatn = parseLocale('sr-Latn');
      expect(srLatn.language).toBe('sr');
      expect(srLatn.script).toBe('Latn');
    });

    it('parses language-script-region tags', () => {
      const zhHansCn = parseLocale('zh-Hans-CN');
      expect(zhHansCn.language).toBe('zh');
      expect(zhHansCn.script).toBe('Hans');
      expect(zhHansCn.region).toBe('CN');
      expect(zhHansCn.direction).toBe('ltr');

      const azArabIr = parseLocale('az-Arab-IR');
      expect(azArabIr.language).toBe('az');
      expect(azArabIr.script).toBe('Arab');
      expect(azArabIr.region).toBe('IR');
      expect(azArabIr.direction).toBe('rtl');
    });

    it('handles casing normalization correctly', () => {
      const parsed = parseLocale('eN-uS');
      expect(parsed.language).toBe('en');
      expect(parsed.region).toBe('US');
    });

    it('resists ReDoS attacks with extreme string lengths', () => {
      const longInput = 'en-' + 'A'.repeat(50000);
      const start = Date.now();
      const result = parseLocale(longInput);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
      expect(result).toBeDefined();
      expect(result.language).toBe('en');
    });

    it('safely handles empty, null, undefined, or whitespace', () => {
      expect(parseLocale('')).toEqual({
        tag: 'en-US',
        language: 'en',
        region: 'US',
        direction: 'ltr',
      });
      expect(parseLocale(null as unknown as string)).toBeDefined();
      expect(parseLocale(undefined as unknown as string)).toBeDefined();
      expect(parseLocale('   ')).toBeDefined();
    });

    it('handles malformed tags with unusual separators', () => {
      const malformed = parseLocale('en_US');
      expect(malformed.language).toBe('en');
      expect(malformed.region).toBe('US');
    });
  });

  describe('getDirection', () => {
    it('identifies primary RTL languages', () => {
      expect(getDirection('ar')).toBe('rtl');
      expect(getDirection('he')).toBe('rtl');
      expect(getDirection('fa')).toBe('rtl');
      expect(getDirection('ur')).toBe('rtl');
      expect(getDirection('ps')).toBe('rtl');
      expect(getDirection('sd')).toBe('rtl');
      expect(getDirection('ug')).toBe('rtl');
      expect(getDirection('yi')).toBe('rtl');
      expect(getDirection('dv')).toBe('rtl');
      expect(getDirection('ckb')).toBe('rtl');
      expect(getDirection('ks')).toBe('rtl');
      expect(getDirection('pnb')).toBe('rtl');
    });

    it('identifies RTL script subtags with non-RTL primary languages', () => {
      expect(getDirection('ku-Arab')).toBe('rtl');
      expect(getDirection('az-Arab')).toBe('rtl');
      expect(getDirection('pa-Arab')).toBe('rtl');
      expect(getDirection('syr-Syrc')).toBe('rtl');
      expect(getDirection('en-Arab')).toBe('rtl');
      expect(getDirection('he-Hebr')).toBe('rtl');
    });

    it('identifies LTR languages and scripts', () => {
      expect(getDirection('en-US')).toBe('ltr');
      expect(getDirection('fr-FR')).toBe('ltr');
      expect(getDirection('de-DE')).toBe('ltr');
      expect(getDirection('es-ES')).toBe('ltr');
      expect(getDirection('zh-CN')).toBe('ltr');
      expect(getDirection('ja-JP')).toBe('ltr');
      expect(getDirection('ko-KR')).toBe('ltr');
      expect(getDirection('ru-RU')).toBe('ltr');
      expect(getDirection('hi-IN')).toBe('ltr');
    });

    it('handles invalid inputs gracefully and defaults to ltr', () => {
      expect(getDirection('')).toBe('ltr');
      expect(getDirection('   ')).toBe('ltr');
      expect(getDirection(null as unknown as string)).toBe('ltr');
      expect(getDirection(undefined as unknown as string)).toBe('ltr');
      expect(getDirection(123 as unknown as string)).toBe('ltr');
    });
  });

  describe('matchLocale', () => {
    const supported = [
      'en-US',
      'en-GB',
      'fr-FR',
      'fr-CA',
      'zh-Hans-CN',
      'zh-Hant-TW',
      'ar-EG',
      'de-DE',
    ];

    it('matches exact tags (case-insensitive)', () => {
      expect(matchLocale('en-US', supported, 'en-US')).toBe('en-US');
      expect(matchLocale('en-us', supported, 'en-US')).toBe('en-US');
      expect(matchLocale('FR-CA', supported, 'en-US')).toBe('fr-CA');
    });

    it('matches by language and region when exact matches exist', () => {
      expect(matchLocale('en-gb', supported, 'en-US')).toBe('en-GB');
      expect(matchLocale('fr-ca', supported, 'en-US')).toBe('fr-CA');
    });

    it('matches by language and script', () => {
      expect(matchLocale('zh-Hans-SG', supported, 'en-US')).toBe('zh-Hans-CN');
      expect(matchLocale('zh-Hant-HK', supported, 'en-US')).toBe('zh-Hant-TW');
    });

    it('matches by language-only fallback when region does not match', () => {
      expect(matchLocale('fr-BE', supported, 'en-US')).toBe('fr-FR');
      expect(matchLocale('de-AT', supported, 'en-US')).toBe('de-DE');
    });

    it('prioritizes first matching preference from array', () => {
      expect(matchLocale(['es-ES', 'fr-CA', 'de-DE'], supported, 'en-US')).toBe(
        'fr-CA'
      );
      expect(matchLocale(['ja-JP', 'ko-KR', 'ar-SA'], supported, 'en-US')).toBe(
        'ar-EG'
      );
    });

    it('returns defaultLocale when no match is found', () => {
      expect(matchLocale('ja-JP', supported, 'en-US')).toBe('en-US');
      expect(matchLocale(['ko-KR', 'vi-VN'], supported, 'fr-FR')).toBe('fr-FR');
    });

    it('handles empty supported list safely', () => {
      expect(matchLocale('en-US', [], 'en-US')).toBe('en-US');
    });

    it('handles empty or invalid requested items safely', () => {
      expect(matchLocale('', supported, 'en-US')).toBe('en-US');
      expect(matchLocale(['', '   '], supported, 'en-US')).toBe('en-US');
    });
  });
});
