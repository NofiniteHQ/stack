import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <PasswordInput aria-label="Password" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders input as password by default', () => {
    render(<PasswordInput aria-label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when the eye icon is clicked', async () => {
    render(<PasswordInput aria-label="Password" />);
    const input = screen.getByLabelText('Password');
    const toggleBtn = screen.getByLabelText('Show password');
    
    // Initially hidden
    expect(input).toHaveAttribute('type', 'password');
    
    // Click to show
    await userEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
    expect(toggleBtn).toHaveAttribute('aria-label', 'Hide password');
    
    // Click to hide again
    await userEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'password');
    expect(toggleBtn).toHaveAttribute('aria-label', 'Show password');
  });
});
