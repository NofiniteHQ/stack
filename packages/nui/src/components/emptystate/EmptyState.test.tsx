import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';

describe('EmptyState Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <EmptyState title="No items" description="Please add some items." />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders title and description', () => {
    render(<EmptyState title="No data" description="Try a different search." />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Try a different search.')).toBeInTheDocument();
  });

  it('renders icon and actions when provided', () => {
    render(
      <EmptyState 
        title="Empty" 
        icon={<div data-testid="test-icon" />}
        actions={<button>Click Me</button>}
      />
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });
});
