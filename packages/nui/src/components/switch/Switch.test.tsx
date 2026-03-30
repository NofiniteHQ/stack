import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('renders with correct ARIA roles and states', () => {
    render(<Switch label="Notifications" checked={true} />);
    const switchBtn = screen.getByRole('switch');

    expect(switchBtn).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('toggles state on click when uncontrolled', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Switch onChange={onChangeSpy} />);
    
    const switchBtn = screen.getByRole('switch');
    await user.click(switchBtn);
    
    expect(onChangeSpy).toHaveBeenCalledWith(true);
    expect(switchBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles state when the associated label is clicked', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Switch label="Airplane Mode" onChange={onChangeSpy} />);
    
    const label = screen.getByText('Airplane Mode');
    await user.click(label);

    const switchBtn = screen.getByRole('switch');
    expect(onChangeSpy).toHaveBeenCalledWith(true);
    expect(switchBtn).toHaveAttribute('aria-checked', 'true');
    expect(switchBtn).toHaveFocus();
  });

  it('handles keyboard "Space" and "Enter" keys', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Switch onChange={onChangeSpy} />);
    
    const switchBtn = screen.getByRole('switch');
    switchBtn.focus();

    await user.keyboard(' ');
    expect(onChangeSpy).toHaveBeenCalledWith(true);

    await user.keyboard('{Enter}');
    expect(onChangeSpy).toHaveBeenCalledWith(false);
  });

  it('is linked to its description for accessibility', () => {
    render(<Switch description="Enable push alerts" />);
    const switchBtn = screen.getByRole('switch');
    const description = screen.getByText('Enable push alerts');

    expect(switchBtn).toHaveAttribute('aria-describedby', description.id);
  });

  it('does not trigger onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Switch disabled onChange={onChangeSpy} />);

    const switchBtn = screen.getByRole('switch');
    await user.click(switchBtn);
    
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(switchBtn).toHaveAttribute('aria-disabled', 'true');
  });
});