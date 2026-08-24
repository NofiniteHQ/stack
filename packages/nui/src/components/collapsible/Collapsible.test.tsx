import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

describe('Collapsible Component', () => {
  it('renders title', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Test Title</CollapsibleTrigger>
        <CollapsibleContent>Test Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('triggers onToggle callback', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    
    render(
      <Collapsible onToggle={handleToggle}>
        <CollapsibleTrigger>Test Title</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    
    await user.click(screen.getByText('Test Title'));
    expect(handleToggle).toHaveBeenCalledWith(true);
  });
});
