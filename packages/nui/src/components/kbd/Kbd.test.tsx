import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { Kbd } from './Kbd';

describe('Kbd Component', () => {
  const originalPlatform = navigator.platform;

  afterEach(() => {
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
      writable: true,
    });
  });

  describe('Basic Rendering', () => {
    it('renders with standard kbd HTML tag', () => {
      render(<Kbd>Enter</Kbd>);
      const kbd = screen.getByText('Enter');
      expect(kbd).toBeInTheDocument();
      expect(kbd.tagName).toBe('KBD');
      expect(kbd).toHaveClass(
        'inline-flex',
        'font-mono',
        'rounded-md',
        'border'
      );
    });

    it('forwards ref to the native kbd element', () => {
      const ref = createRef<HTMLElement>();
      render(<Kbd ref={ref}>Esc</Kbd>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('KBD');
    });

    it('merges custom className with default classes', () => {
      render(<Kbd className="custom-kbd-style">Tab</Kbd>);
      const kbd = screen.getByText('Tab');
      expect(kbd).toHaveClass('custom-kbd-style');
      expect(kbd).toHaveClass('font-mono');
    });
  });

  describe('Modifier Keys & Key Combinations (Non-Mac Platform)', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        configurable: true,
        writable: true,
      });
    });

    it('translates ⌘ symbol to Ctrl', () => {
      render(<Kbd>⌘</Kbd>);
      expect(screen.getByText('Ctrl')).toBeInTheDocument();
    });

    it('translates ⌥ symbol to Alt', () => {
      render(<Kbd>⌥</Kbd>);
      expect(screen.getByText('Alt')).toBeInTheDocument();
    });

    it('translates ⇧ symbol to Shift', () => {
      render(<Kbd>⇧</Kbd>);
      expect(screen.getByText('Shift')).toBeInTheDocument();
    });

    it('translates textual modifier names (Cmd, Option)', () => {
      render(
        <div>
          <Kbd>Cmd</Kbd>
          <Kbd>Option</Kbd>
        </div>
      );
      expect(screen.getByText('Ctrl')).toBeInTheDocument();
      expect(screen.getByText('Alt')).toBeInTheDocument();
    });

    it('translates combo string like ⌘K to Ctrl + K', () => {
      render(<Kbd>⌘K</Kbd>);
      expect(screen.getByText('Ctrl + K')).toBeInTheDocument();
    });

    it('translates compound modifier shortcuts like ⌘ + ⌥ + P', () => {
      render(<Kbd>⌘ + ⌥ + P</Kbd>);
      expect(screen.getByText('Ctrl + Alt + P')).toBeInTheDocument();
    });
  });

  describe('Mac Platform Preservation', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        configurable: true,
        writable: true,
      });
    });

    it('preserves native Mac symbols on macOS', () => {
      render(<Kbd>⌘K</Kbd>);
      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('preserves ⌥ and ⇧ symbols on macOS', () => {
      render(
        <div>
          <Kbd>⌥</Kbd>
          <Kbd>⇧</Kbd>
        </div>
      );
      expect(screen.getByText('⌥')).toBeInTheDocument();
      expect(screen.getByText('⇧')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('applies md size styles by default', () => {
      render(<Kbd>Ctrl</Kbd>);
      const kbd = screen.getByText('Ctrl');
      expect(kbd).toHaveClass('text-xs', 'h-6', 'min-w-[1.5rem]');
    });

    it('applies sm size styles when size="sm"', () => {
      render(<Kbd size="sm">Ctrl</Kbd>);
      const kbd = screen.getByText('Ctrl');
      expect(kbd).toHaveClass('text-[10px]', 'h-5', 'min-w-[1.25rem]');
    });

    it('applies lg size styles when size="lg"', () => {
      render(<Kbd size="lg">Ctrl</Kbd>);
      const kbd = screen.getByText('Ctrl');
      expect(kbd).toHaveClass('text-sm', 'h-7', 'min-w-[1.75rem]');
    });
  });

  describe('Accessibility & Keyboard Contracts', () => {
    it('accepts and renders aria-keyshortcuts attribute', () => {
      render(<Kbd aria-keyshortcuts="Control+K">Ctrl + K</Kbd>);
      const kbd = screen.getByText('Ctrl + K');
      expect(kbd).toHaveAttribute('aria-keyshortcuts', 'Control+K');
    });

    it('passes axe accessibility audit', async () => {
      const { container } = render(
        <div>
          <span>Press</span>
          <Kbd aria-keyshortcuts="Control+S">Ctrl + S</Kbd>
          <span>to save</span>
        </div>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
