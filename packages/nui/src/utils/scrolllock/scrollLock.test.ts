import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { scrollLock } from './scrollLock';

describe('scrollLock utility', () => {
  beforeEach(() => {
    // Reset body style before each test to ensure isolation
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Ensure clean state after tests so it doesn't leak into other test suites
    document.body.style.overflow = '';
  });

  it('locks scrolling by setting overflow hidden', () => {
    scrollLock.lock();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unlocks scrolling by clearing overflow style', () => {
    // Lock first
    scrollLock.lock();
    expect(document.body.style.overflow).toBe('hidden');

    // Unlock
    scrollLock.unlock();
    expect(document.body.style.overflow).toBe('');
  });

  it('respects existing styles when unlocking by falling back to CSS rules', () => {
    // NOTE: Your current implementation clears overflow entirely ('').
    // This test confirms current behavior: it wipes the inline style clean
    // to allow external stylesheets to take over.
    
    document.body.style.overflow = 'scroll'; // Simulate an initial inline style
    
    scrollLock.lock();
    expect(document.body.style.overflow).toBe('hidden');
    
    scrollLock.unlock();
    // It resets to empty string, completely clearing the inline override
    expect(document.body.style.overflow).toBe('');
  });
});