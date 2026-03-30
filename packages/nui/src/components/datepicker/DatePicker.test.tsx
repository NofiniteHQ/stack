import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 24));
    
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('opens the calendar popover on click', async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      
      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText(/october 2026/i)).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('selects a date and updates the trigger label', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();
      render(<DatePicker onChange={onChangeSpy} />);

      await user.click(screen.getByRole('button'));

      const day15 = screen.getByRole('button', { name: '15' });
      await user.click(day15);

      expect(onChangeSpy).toHaveBeenCalledWith('2026-10-15');
      expect(screen.getByText(/oct 15, 2026/i)).toBeInTheDocument();
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('Constraints', () => {
    it('respects minDate and disables previous days', async () => {
      const user = userEvent.setup();
      render(<DatePicker minDate="2026-10-20" />);
      
      await user.click(screen.getByRole('button'));

      const day10 = screen.getByRole('button', { name: '10' });
      expect(day10).toBeDisabled();

      const day25 = screen.getByRole('button', { name: '25' });
      expect(day25).not.toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates through days using ArrowKeys', async () => {
      const user = userEvent.setup();
      render(<DatePicker defaultValue="2026-10-15" />);
      
      await user.click(screen.getByRole('button'));

      // Ensure focus lands specifically on the Day BUTTON, not just the grid wrapper
      await waitFor(() => {
        expect(document.activeElement).toHaveTextContent('15');
        expect(document.activeElement?.tagName).toBe('BUTTON');
      });

      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toHaveTextContent('16');

      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toHaveTextContent('23');
      
      await user.keyboard('{Enter}');
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });
});