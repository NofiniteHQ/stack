import { describe, it, expect } from 'vitest';
import { isBrowser, copyToClipboard, scrollIntoView, trapFocus } from './index';

describe('DOM Utilities', () => {
  it('correctly reports isBrowser() status without crashing in Node', () => {
    // In node environment without simulated DOM
    const browser = isBrowser();
    expect(typeof browser).toBe('boolean');
  });

  it('safely handles scrollIntoView and trapFocus when not in browser or missing elements', () => {
    expect(() => scrollIntoView(null)).not.toThrow();
    expect(() => trapFocus(null, null)).not.toThrow();
  });

  it('handles copyToClipboard() in headless/non-browser environment cleanly', async () => {
    const res = await copyToClipboard('test copy');
    expect(typeof res).toBe('boolean');
  });
});
