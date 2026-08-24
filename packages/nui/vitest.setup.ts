/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
import { MotionGlobalConfig } from 'framer-motion';


import { vi } from 'vitest';
import React from 'react';
MotionGlobalConfig.skipAnimations = true;


vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => {
       const isPresent = React.Children.toArray(children).some(child => React.isValidElement(child));
       return isPresent ? children : null;
    }
  };
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof global.PointerEvent === 'undefined') {
  global.PointerEvent = class PointerEvent extends MouseEvent {};
}

global.HTMLElement.prototype.scrollIntoView = vi.fn();
global.HTMLElement.prototype.hasPointerCapture = vi.fn();
global.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.HTMLElement.prototype.getBoundingClientRect = function() {
  return { width: 100, height: 100, top: 0, left: 0, bottom: 100, right: 100, x: 0, y: 0, toJSON: () => {} };
};
