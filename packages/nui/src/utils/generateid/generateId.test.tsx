import { describe, it, expect } from 'vitest';
import { generateId } from './generateId';

describe('generateId utility', () => {
  it('generates an ID starting with the given prefix', () => {
    const id = generateId('btn');
    expect(id).toMatch(/^btn-/);
  });

  it('generates unique IDs on subsequent calls', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    
    expect(id1).not.toBe(id2);
  });

  it('generates an ID with valid characters (alphanumeric)', () => {
    const id = generateId('field');
    
    // Expected format: field-xxxxxx (exactly 6 random chars from the slice)
    const parts = id.split('-');
    
    expect(parts[0]).toBe('field');
    expect(parts[1]).toHaveLength(6);
    expect(parts[1]).toMatch(/^[a-z0-9]+$/);
  });

  it('handles empty prefix', () => {
    const id = generateId('');
    
    // Should start with a dash since the prefix is empty
    expect(id).toMatch(/^-/); 
    // Length is the dash (1) + the 6 sliced characters (6) = 7
    expect(id.length).toBeGreaterThan(6);
  });
});