import { describe, it, expect } from 'vitest';
import { countries } from './countries';

describe('Data Integrity', () => {
  
  it('should have a list of countries', () => {
    expect(countries.length).toBeGreaterThan(0);
  });

  it('should have valid ISO codes for every country', () => {
    countries.forEach((country) => {
      expect(country.iso2).toBeDefined();
      expect(country.iso2.length).toBe(2);
      expect(country.dialCode).toContain('+');
    });
  });

  it('should not have duplicate ISO codes', () => {
    const isoCodes = countries.map(c => c.iso2);
    const uniqueIsoCodes = new Set(isoCodes);
    expect(uniqueIsoCodes.size).toBe(isoCodes.length);
  });
});