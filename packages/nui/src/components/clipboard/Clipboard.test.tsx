/** @vitest-environment jsdom */
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Clipboard } from './Clipboard';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('Clipboard Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Clipboard value="test" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the value', () => {
    render(<Clipboard value="test string" />);
    expect(screen.getByText('test string')).toBeInTheDocument();
  });

  it('copies to clipboard on click', async () => {
    render(<Clipboard value="hello world" />);
    const btn = screen.getByRole('button', { name: 'Copy to clipboard' });
    
    await userEvent.click(btn);
    
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world'));
  });

  it('temporarily shows success state', async () => {
    render(<Clipboard value="test" timeout={100} />);
    const btn = screen.getByRole('button', { name: 'Copy to clipboard' });
    
    // Initially not success text
    expect(btn).not.toHaveClass('text-success');
    
    fireEvent.click(btn);
    
    // Should have success class
    await waitFor(() => {
      expect(btn).toHaveClass('text-success');
    });

    // Should revert after timeout
    await waitFor(() => {
      expect(btn).not.toHaveClass('text-success');
    }, { timeout: 300 });
  });
});
