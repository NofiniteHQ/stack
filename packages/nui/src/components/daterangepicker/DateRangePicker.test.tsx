import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

      expect(screen.getByDisplayValue('2026-10-01')).toHaveAttribute('type', 'hidden');
      expect(screen.getByDisplayValue('2026-10-05')).toHaveAttribute('type', 'hidden');
    });
  });

  describe('Interactions', () => {
    it('opens popover', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);

      await user.click(screen.getByRole('button', { name: /Pick range/i }));
      expect(screen.getByText('Start Date')).toBeInTheDocument();
    });

    it('selects start and end date via click', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(<DateRangePicker onChange={onChangeSpy} />);

      await user.click(screen.getByRole('button', { name: /Pick range/i }));

      // Changed 'button' to 'gridcell' to match the updated WAI-ARIA role
      const day6 = screen.getByRole('gridcell', { name: '6' });
      const day11 = screen.getByRole('gridcell', { name: '11' });

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

      render(<DateRangePicker onChange={onChangeSpy} />);

      await user.click(screen.getByRole('button', { name: /Pick range/i }));

      const day6 = screen.getByRole('gridcell', { name: '6' });
      const day11 = screen.getByRole('gridcell', { name: '11' });

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

      render(<DateRangePicker onChange={onChangeSpy} placeholder="Test Range" />);

      await user.click(screen.getByRole('button', { name: /Test Range/i }));

      await user.click(screen.getByRole('gridcell', { name: '15' }));
      
      expect(screen.getByText('End Date')).toHaveClass('active');

      await user.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledWith({ from: undefined, to: undefined });

      await user.click(screen.getByRole('button', { name: /Test Range/i }));
      expect(screen.getByText('Start Date')).toHaveClass('active');
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
      expect(screen.getByRole('button', { name: /Disabled Range/i })).toBeDisabled();
    });

    it('blocks minDate selection', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker minDate="2026-10-20" placeholder="Min Date Range" />);

      await user.click(screen.getByRole('button', { name: /Min Date Range/i }));

      const day1 = screen.getByRole('gridcell', { name: '1' });
      expect(day1).toBeDisabled();
    });

    it('mutes End Date until Start Date is selected', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker placeholder="Mute Test" />);
  
      await user.click(screen.getByRole('button', { name: /Mute Test/i }));
  
      const endDateTab = screen.getByText('End Date');
      expect(endDateTab).toBeDisabled();
  
      await user.click(screen.getByRole('gridcell', { name: '10' }));
  
      expect(endDateTab).not.toBeDisabled();
      expect(endDateTab).toHaveClass('active');
    });
  });

  describe('Advanced Navigation & Selection', () => {
    it('navigates and selects via keyboard', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();
      render(<DateRangePicker onChange={onChangeSpy} placeholder="Keyboard Nav" />);
  
      await user.click(screen.getByRole('button', { name: /Keyboard Nav/i }));
  
      await waitFor(() => {
        expect(document.activeElement).toHaveAttribute('role', 'grid');
      });
  
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toHaveTextContent('24');
  
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toHaveTextContent('23');
  
      await user.keyboard('{Enter}');
      
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ from: '2026-10-23' }));
      expect(screen.getByText('End Date')).not.toBeDisabled();
      expect(screen.getByText('End Date')).toHaveClass('active');
  
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');
  
      expect(onChangeSpy).toHaveBeenCalledWith({ from: '2026-10-23', to: '2026-10-25' });
    });

    it('drag selection commits range', async () => {
      const user = userEvent.setup();
      const onChangeSpy = vi.fn();

      render(<DateRangePicker onChange={onChangeSpy} placeholder="Drag Range" />);

      await user.click(screen.getByRole('button', { name: /Drag Range/i }));

      const day6 = screen.getByRole('gridcell', { name: '6' });
      const day9 = screen.getByRole('gridcell', { name: '9' });

      fireEvent.mouseDown(day6);
      fireEvent.mouseEnter(day9);
      fireEvent.mouseUp(window);

      expect(onChangeSpy).toHaveBeenLastCalledWith({
        from: '2026-10-06', 
        to: '2026-10-09',
      });
    });
  });
});