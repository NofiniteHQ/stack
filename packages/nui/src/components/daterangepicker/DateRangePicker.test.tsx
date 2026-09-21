import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker Component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 24));

    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders placeholder', () => {
      render(<DateRangePicker placeholder="Pick range" />);
      expect(screen.getByText('Pick range')).toBeInTheDocument();
    });

    it('renders hidden inputs for form submission', () => {
      render(
        <DateRangePicker
          value={{ from: '2026-10-01', to: '2026-10-05' }}
          nameFrom="start"
          nameTo="end"
        />
      );

      expect(screen.getByDisplayValue('2026-10-01')).toHaveAttribute(
        'type',
        'hidden'
      );
      expect(screen.getByDisplayValue('2026-10-05')).toHaveAttribute(
        'type',
        'hidden'
      );
    });
  });

  describe('Interactions', () => {
    it('opens popover', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker placeholder="Pick range" />);

      await user.click(screen.getByRole('button', { name: /Pick range/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('selects start and end date via click', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <DateRangePicker onChange={onChangeSpy} placeholder="Pick range" />
      );

      await user.click(screen.getByRole('button', { name: /Pick range/i }));

      const day6 = screen.getByRole('button', { name: '6' });
      const day11 = screen.getByRole('button', { name: '11' });

      await user.click(day6);
      await user.click(day11);

      expect(onChangeSpy).toHaveBeenCalledWith({
        from: '2026-10-06',
        to: '2026-10-11',
      });
    });

    it('normalizes reversed range selection', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <DateRangePicker onChange={onChangeSpy} placeholder="Pick range" />
      );

      await user.click(screen.getByRole('button', { name: /Pick range/i }));

      const day6 = screen.getByRole('button', { name: '6' });
      const day11 = screen.getByRole('button', { name: '11' });

      await user.click(day11);
      await user.click(day6);

      expect(onChangeSpy).toHaveBeenLastCalledWith({
        from: '2026-10-06',
        to: undefined,
      });
    });

    it('clear button resets range and active part', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(
        <DateRangePicker onChange={onChangeSpy} placeholder="Test Range" />
      );

      await user.click(screen.getByRole('button', { name: /Test Range/i }));

      await user.click(screen.getByRole('button', { name: '15' }));

      await user.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledWith({
        from: undefined,
        to: undefined,
      });
    });

    it('closes month/year panel upon month selection', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker placeholder="YMM Test" />);

      await user.click(screen.getByRole('button', { name: /YMM Test/i }));

      const toggleBtn = screen.getByText(/October 2026/i);
      await user.click(toggleBtn);

      const novemberBtn = screen.getByRole('button', { name: 'Nov' });
      await user.click(novemberBtn);

      expect(screen.getByText(/November 2026/i)).toBeInTheDocument();
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Constraints', () => {
    it('respects disabled state', () => {
      render(<DateRangePicker disabled placeholder="Disabled Range" />);
      expect(
        screen.getByRole('button', { name: /Disabled Range/i })
      ).toBeDisabled();
    });

    it('blocks minDate selection', async () => {
      const user = userEvent.setup();

      render(
        <DateRangePicker minDate="2026-10-20" placeholder="Min Date Range" />
      );

      await user.click(screen.getByRole('button', { name: /Min Date Range/i }));

      const day1 = screen.getByRole('button', { name: '1' });
      expect(day1).toBeDisabled();
    });
  });

  describe('Advanced Navigation & Selection', () => {
    it('navigates and selects via keyboard', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();
      render(
        <DateRangePicker onChange={onChangeSpy} placeholder="Keyboard Nav" />
      );

      await user.click(screen.getByRole('button', { name: /Keyboard Nav/i }));

      await waitFor(() => {
        expect(document.activeElement?.tagName).toBe('BUTTON');
      });

      // Press Enter to select current focused day (1st)
      await user.keyboard('{Enter}');
      expect(onChangeSpy).toHaveBeenCalledWith({
        from: '2026-10-01',
        to: undefined,
      });

      // Move right to 2nd
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toHaveTextContent('2');
      await user.keyboard('{Enter}');
      expect(onChangeSpy).toHaveBeenCalledWith({
        from: '2026-10-01',
        to: '2026-10-02',
      });
    });

    it('drag selection commits range', async () => {
      const onChangeSpy = vi.fn();

      render(
        <DateRangePicker onChange={onChangeSpy} placeholder="Drag Range" />
      );

      fireEvent.click(screen.getByRole('button', { name: /Drag Range/i }));

      const day6 = screen.getByRole('button', { name: '6' });
      const day9 = screen.getByRole('button', { name: '9' });

      fireEvent.mouseDown(day6);
      fireEvent.mouseEnter(day9);
      fireEvent.mouseUp(window);

      expect(onChangeSpy).toHaveBeenLastCalledWith({
        from: '2026-10-06',
        to: '2026-10-09',
      });
    });
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { container } = render(<DateRangePicker />);
      expect(await axe(container)).toHaveNoViolations();
    }, 10000);
  });
});
