import { describe, it, expect } from 'vitest';
import { getCountryByCode, getCountryByDialCode } from './core';

describe('Core Logic', () => {
  
  describe('getCountryByCode', () => {
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
  });

  describe('getCountryByDialCode', () => {
    it('should find a country by dial code with plus (+91)', () => {
      const country = getCountryByDialCode('+91');
      expect(country?.iso2).toBe('IN');
    });

    it('should find a country by dial code without plus (1)', () => {
      const country = getCountryByDialCode('1');
      expect(country?.iso2).toBe('CA'); // Note: returns first match (US or CA)
    });

    it('should return undefined for non-existent codes', () => {
      const country = getCountryByDialCode('99999');
      expect(country).toBeUndefined();
    });
  });
});