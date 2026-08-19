import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { PinInput } from './PinInput';

describe('PinInput Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <PinInput length={4} aria-label="PIN Code" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correct number of inputs', () => {
    render(<PinInput length={6} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('handles typing and auto-advances focus', async () => {
    const handleChange = vi.fn();
    render(<PinInput length={4} onChange={handleChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    await userEvent.type(inputs[0], '1');
    expect(handleChange).toHaveBeenCalledWith('1');
    expect(inputs[1]).toHaveFocus();

    await userEvent.type(inputs[1], '2');
    expect(handleChange).toHaveBeenCalledWith('12');
    expect(inputs[2]).toHaveFocus();
  });

  it('calls onComplete when all fields are filled', async () => {
    const handleComplete = vi.fn();
    render(<PinInput length={4} onComplete={handleComplete} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    await userEvent.type(inputs[0], '1');
    await userEvent.type(inputs[1], '2');
    await userEvent.type(inputs[2], '3');
    await userEvent.type(inputs[3], '4');
    
    expect(handleComplete).toHaveBeenCalledWith('1234');
  });

  it('handles backspace correctly', async () => {
    render(<PinInput length={4} value="12" />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Deleting the empty 3rd input should move focus to 2nd input
    await userEvent.type(inputs[2], '{Backspace}');
    expect(inputs[1]).toHaveFocus();
    
    // Value should now be '1' because we deleted index 1
    // Wait, backspace on empty input deletes previous value!
  });
});
