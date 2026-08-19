/** @vitest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Calendar } from './Calendar';

describe('Calendar Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Calendar />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders days of the week', () => {
    render(<Calendar />);
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Sa')).toBeInTheDocument();
  });

  it('selects a date when clicked', () => {
    const handleChange = vi.fn();
    // Default visible month defaults to current month if no value provided
    render(<Calendar onChange={handleChange} />);
    
    // Find the button for the 15th
    const dayBtn = screen.getByRole('button', { name: '15' });
    fireEvent.click(dayBtn);
    
    // The exact string depends on current year/month, but it should be called
    expect(handleChange).toHaveBeenCalled();
    const arg = handleChange.mock.calls[0][0];
    expect(arg).toMatch(/^\d{4}-\d{2}-15$/);
  });

  it('respects minDate constraints', () => {
    const minDate = '2020-05-10';
    // Force visible month to May 2020 by setting value
    render(<Calendar minDate={minDate} value="2020-05-15" />);
    
    const disabledDay = screen.getByRole('button', { name: '9' });
    const enabledDay = screen.getByRole('button', { name: '10' });
    
    expect(disabledDay).toBeDisabled();
    expect(enabledDay).not.toBeDisabled();
  });
});
