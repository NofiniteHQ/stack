import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges string arguments', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('ignores falsy values (false, null, undefined)', () => {
    expect(cn('btn', false, null, undefined, 'active')).toBe('btn active');
  });

  it('handles objects with boolean values', () => {
    expect(cn({ 
      'flex': true, 
      'hidden': false,
      'items-center': true 
    })).toBe('flex items-center');
  });

  it('handles arrays and nested arrays', () => {
    expect(cn(['px-4', 'py-2'], [['rounded']])).toBe('px-4 py-2 rounded');
  });

  it('handles mixed inputs (strings, objects, arrays)', () => {
    const isPrimary = true;
    const isDisabled = false;

    const result = cn(
      'base-class',
      [ 'p-4', 'm-2' ],
      { 
        'bg-blue': isPrimary, 
        'opacity-50': isDisabled 
      }
    );

    expect(result).toBe('base-class p-4 m-2 bg-blue');
  });

  it('returns empty string for empty input', () => {
    expect(cn()).toBe('');
    expect(cn(null)).toBe('');
  });
});