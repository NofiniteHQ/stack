import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ScrollArea aria-label="Terms of service">
        <p>Some content</p>
      </ScrollArea>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders children correctly', () => {
    render(
      <ScrollArea>
        <div>Scrollable Content</div>
      </ScrollArea>
    );
    expect(screen.getByText('Scrollable Content')).toBeInTheDocument();
  });

  it('applies vertical overflow by default', () => {
    render(<ScrollArea data-testid="scroll" />);
    const scrollArea = screen.getByTestId('scroll');
    expect(scrollArea).toHaveClass('overflow-x-hidden');
    expect(scrollArea).not.toHaveClass('overflow-y-hidden');
  });

  it('applies horizontal overflow when specified', () => {
    render(<ScrollArea orientation="horizontal" data-testid="scroll-h" />);
    const scrollArea = screen.getByTestId('scroll-h');
    expect(scrollArea).toHaveClass('overflow-y-hidden');
    expect(scrollArea).not.toHaveClass('overflow-x-hidden');
  });
});
