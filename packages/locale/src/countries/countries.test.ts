import { describe, it, expect } from 'vitest';
import {
  countries,
  getCountryByCode,
  getCountryByDialCode,
  getCountriesByDialCode,
  getCountryMetadata,
} from './index';

describe('Decoupled Country Lookups', () => {
  describe('getCountryByCode', () => {
    it('retrieves countries by ISO2 code via O(1) map', () => {
      const inCountry = getCountryByCode('IN');
      expect(inCountry?.name).toBe('India');
      expect(inCountry?.dialCode).toBe('+91');

      const usCountry = getCountryByCode('US');
      expect(usCountry?.name).toBe('United States');
      expect(usCountry?.dialCode).toBe('+1');
      expect(usCountry?.iso2).toBe('US');
    });

    it('handles case-insensitivity across uppercase, lowercase, and mixed case', () => {
      expect(getCountryByCode('gb')?.iso2).toBe('GB');
      expect(getCountryByCode('Gb')?.iso2).toBe('GB');
      expect(getCountryByCode('gB')?.iso2).toBe('GB');
      expect(getCountryByCode('GB')?.iso2).toBe('GB');
    });

    it('trims leading and trailing whitespace', () => {
      expect(getCountryByCode('  FR  ')?.iso2).toBe('FR');
      expect(getCountryByCode('\tDE\n')?.iso2).toBe('DE');
    });

    it('returns undefined for non-existent ISO2 codes', () => {
      expect(getCountryByCode('XX')).toBeUndefined();
      expect(getCountryByCode('ZZ')).toBeUndefined();
      expect(getCountryByCode('ABC')).toBeUndefined();
    });

    it('returns undefined for empty, null, undefined, or non-string inputs', () => {
      expect(getCountryByCode('')).toBeUndefined();
      expect(getCountryByCode('   ')).toBeUndefined();
      expect(getCountryByCode(null as unknown as string)).toBeUndefined();
      expect(getCountryByCode(undefined as unknown as string)).toBeUndefined();
      expect(getCountryByCode(123 as unknown as string)).toBeUndefined();
    });
  });

  describe('getCountryMetadata alias', () => {
    it('retrieves full country metadata by ISO2 code', () => {
      const jp = getCountryMetadata('JP');
      expect(jp).toBeDefined();
      expect(jp?.name).toBe('Japan');
      expect(jp?.dialCode).toBe('+81');
      expect(jp?.iso2).toBe('JP');
    });
  });

  describe('getCountryByDialCode', () => {
    it('retrieves country by dial code with plus (+91)', () => {
      const country = getCountryByDialCode('+91');
      expect(country?.iso2).toBe('IN');
    });

    it('retrieves country by dial code without plus (91)', () => {
      const country = getCountryByDialCode('91');
      expect(country?.iso2).toBe('IN');
    });

    it('handles dial codes with spaces ("+ 44", " 44 ")', () => {
      expect(['GB', 'GG', 'JE', 'IM']).toContain(
        getCountryByDialCode('+ 44')?.iso2
      );
      expect(['GB', 'GG', 'JE', 'IM']).toContain(
        getCountryByDialCode(' 44 ')?.iso2
      );
    });

    it('returns primary country for shared dial codes (+1)', () => {
      const country = getCountryByDialCode('+1');
      expect(country).toBeDefined();
      expect(['US', 'CA']).toContain(country?.iso2);
    });

    it('returns undefined for non-existent or invalid dial codes', () => {
      expect(getCountryByDialCode('+999999')).toBeUndefined();
      expect(getCountryByDialCode('')).toBeUndefined();
      expect(getCountryByDialCode(null as unknown as string)).toBeUndefined();
      expect(
        getCountryByDialCode(undefined as unknown as string)
      ).toBeUndefined();
    });
  });

  describe('getCountriesByDialCode (LOCALE-SEC-02 Multi-Country Resolution)', () => {
    it('resolves multiple countries sharing +1 dial code (US, CA, PR, etc.)', () => {
      const plusOne = getCountriesByDialCode('+1');
      expect(plusOne.length).toBeGreaterThan(1);
      const isoCodes = plusOne.map((c) => c.iso2);
      expect(isoCodes).toContain('US');
      expect(isoCodes).toContain('CA');
    });

    it('resolves multiple countries sharing +44 dial code (GB, IM, GG, JE)', () => {
      const plus44 = getCountriesByDialCode('+44');
      expect(plus44.length).toBeGreaterThan(1);
      const isoCodes = plus44.map((c) => c.iso2);
      expect(isoCodes).toContain('GB');
    });

    it('resolves multiple countries sharing +7 dial code (RU, KZ)', () => {
      const plus7 = getCountriesByDialCode('+7');
      expect(plus7.length).toBeGreaterThan(1);
      const isoCodes = plus7.map((c) => c.iso2);
      expect(isoCodes).toContain('RU');
      expect(isoCodes).toContain('KZ');
    });

    it('resolves countries with unique dial codes (+49, +33)', () => {
      const plus49 = getCountriesByDialCode('+49');
      expect(plus49.length).toBe(1);
      expect(plus49[0].iso2).toBe('DE');

      const plus33 = getCountriesByDialCode('+33');
      expect(plus33.length).toBe(1);
      expect(plus33[0].iso2).toBe('FR');
    });

    it('returns empty array for invalid, missing, or empty dial codes', () => {
      expect(getCountriesByDialCode('')).toEqual([]);
      expect(getCountriesByDialCode('+999999')).toEqual([]);
      expect(getCountriesByDialCode(null as unknown as string)).toEqual([]);
    });
  });

  describe('Specific Data Integrity Verifications', () => {
    it('verifies corrected Cayman Islands (+345) dial code', () => {
      const ky = getCountryByCode('KY');
      expect(ky).toBeDefined();
      expect(ky?.dialCode).toBe('+345');
      expect(getCountriesByDialCode('+345').map((c) => c.iso2)).toContain('KY');
    });

    it('verifies corrected Heard Island and McDonald Islands (+672) dial code', () => {
      const hm = getCountryByCode('HM');
      expect(hm).toBeDefined();
      expect(hm?.dialCode).toBe('+672');
      expect(getCountriesByDialCode('+672').map((c) => c.iso2)).toContain('HM');
    });

    it('verifies total dataset count and uniqueness of ISO2 codes', () => {
      expect(countries.length).toBeGreaterThan(240);
      const seen = new Set<string>();
      for (const country of countries) {
        expect(country.iso2).toHaveLength(2);
        expect(country.name.length).toBeGreaterThan(0);
        expect(country.dialCode.startsWith('+')).toBe(true);
        expect(seen.has(country.iso2)).toBe(false);
        seen.add(country.iso2);
      }
    });
  });
});
