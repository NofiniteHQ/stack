import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Collapsible } from './Collapsible';

describe('Collapsible Component', () => {
  it('renders title', () => {
    render(<Collapsible title="Test Title">Test Content</Collapsible>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('triggers onToggle callback', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    
    render(<Collapsible title="Test Title" onToggle={handleToggle}>Content</Collapsible>);
    
    const trigger = screen.getByText('Test Title');
    await user.click(trigger);
    
    expect(handleToggle).toHaveBeenCalledWith(true);
  });
});
