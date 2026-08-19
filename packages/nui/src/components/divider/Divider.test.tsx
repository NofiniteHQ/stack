import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Divider } from './Divider';

describe('Divider Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Divider />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders horizontal divider by default', () => {
    render(<Divider data-testid="div-horz" />);
    const divider = screen.getByTestId('div-horz');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders vertical divider when specified', () => {
    render(<Divider orientation="vertical" data-testid="div-vert" />);
    const divider = screen.getByTestId('div-vert');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders children text when provided', () => {
    render(<Divider>OR</Divider>);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });
});
