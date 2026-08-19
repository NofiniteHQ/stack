/** @vitest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Image } from './Image';

describe('Image Component', () => {
  it('should have no accessibility violations with fallback', async () => {
    const { container } = render(<Image alt="fallback" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders a skeleton initially', () => {
    const { container } = render(<Image src="test.jpg" alt="test" />);
    // Skeleton should be present
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows error state when src is invalid', async () => {
    render(<Image src="bad.jpg" alt="bad image" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText('bad image')).toBeInTheDocument();
    });
  });

  it('renders custom fallback when provided', async () => {
    render(<Image src="bad.jpg" alt="test" fallback={<span>Custom Error</span>} />);
    const img = screen.getByRole('img');
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText('Custom Error')).toBeInTheDocument();
    });
  });
});
