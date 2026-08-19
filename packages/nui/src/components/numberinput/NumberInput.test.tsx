import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { NumberInput } from './NumberInput';

describe('NumberInput Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <NumberInput aria-label="Amount" value={10} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders input with value', () => {
    render(<NumberInput aria-label="Amount" value={42} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(42);
  });

  it('calls onChange and handles increments', async () => {
    const handleChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={5} onChange={handleChange} />);
    
    const incBtn = screen.getByLabelText('Increase value');
    await userEvent.click(incBtn);
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it('calls onChange and handles decrements', async () => {
    const handleChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={5} onChange={handleChange} />);
    
    const decBtn = screen.getByLabelText('Decrease value');
    await userEvent.click(decBtn);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('respects min and max bounds on increment', async () => {
    const handleChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={10} max={10} onChange={handleChange} />);
    
    const incBtn = screen.getByLabelText('Increase value');
    await userEvent.click(incBtn);
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it('respects step sizes (decimal)', async () => {
    const handleChange = vi.fn();
    render(<NumberInput aria-label="Price" value={10.5} step={0.5} onChange={handleChange} />);
    
    const incBtn = screen.getByLabelText('Increase value');
    await userEvent.click(incBtn);
    expect(handleChange).toHaveBeenCalledWith(11);
    
    const decBtn = screen.getByLabelText('Decrease value');
    await userEvent.click(decBtn);
    expect(handleChange).toHaveBeenCalledWith(10.5); // since last state was not updated internally if controlled
  });

  it('handles keyboard navigation (ArrowUp, ArrowDown)', async () => {
    const handleChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={5} onChange={handleChange} />);
    
    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '{ArrowUp}');
    expect(handleChange).toHaveBeenCalledWith(6);
    
    await userEvent.type(input, '{ArrowDown}');
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('does not increment or decrement when disabled', async () => {
    const handleChange = vi.fn();
    render(<NumberInput aria-label="Amount" value={5} disabled onChange={handleChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
    
    // Steppers shouldn't even be rendered when disabled
    expect(screen.queryByLabelText('Increase value')).not.toBeInTheDocument();
    
    // Test keyboard when disabled
    await userEvent.type(input, '{ArrowUp}');
    expect(handleChange).not.toHaveBeenCalled();
  });
});
