import { describe, it, expect } from 'vitest';
import { cn } from './index';

describe('cn (Class Names Utility)', () => {
  it('joins strings and handles falsy values', () => {
    expect(cn('btn', 'btn-primary', null, undefined, false, '')).toBe(
      'btn btn-primary'
    );
  });

  it('handles objects with conditional boolean flags', () => {
    expect(
      cn('card', {
        'card-active': true,
        'card-disabled': false,
        'card-elevated': 1,
      })
    ).toBe('card card-active card-elevated');
  });

  it('handles nested arrays and mixed structures', () => {
    expect(cn(['btn', ['btn-sm', { active: true }]], { disabled: false })).toBe(
      'btn btn-sm active'
    );
  });

  it('handles numbers and empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn(null)).toBe('');
    expect(cn('col', 12)).toBe('col 12');
  });
});
