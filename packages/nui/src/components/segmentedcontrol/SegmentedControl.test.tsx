import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SegmentedControl } from './SegmentedControl';

const defaultOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

describe('SegmentedControl Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <SegmentedControl options={defaultOptions} aria-label="Frequency" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders all options', () => {
    render(<SegmentedControl options={defaultOptions} />);
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
  });

  it('calls onChange when an option is clicked', async () => {
    const handleChange = vi.fn();
    render(<SegmentedControl options={defaultOptions} onChange={handleChange} />);
    
    await userEvent.click(screen.getByRole('radio', { name: 'Weekly' }));
    expect(handleChange).toHaveBeenCalledWith('weekly');
  });

  it('does not call onChange when disabled option is clicked', async () => {
    const handleChange = vi.fn();
    render(
      <SegmentedControl 
        options={[{ value: 'a', label: 'A', disabled: true }, { value: 'b', label: 'B' }]} 
        onChange={handleChange} 
      />
    );
    
    await userEvent.click(screen.getByRole('radio', { name: 'A' }));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
