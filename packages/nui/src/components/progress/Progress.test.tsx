import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Progress } from './Progress';

describe('Progress Component', () => {
  it('renders with default props', () => {
    render(<Progress value={50} />);
    const progress = screen.getByRole('progressbar');

    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('calculates percentage correctly with custom max', () => {
    render(<Progress value={20} max={40} />);
    const indicator = screen.getByRole('progressbar').firstChild as HTMLElement;

    // 20/40 = 50%. The style should be translateX(-50%)
    expect(indicator.style.transform).toBe('translateX(-50%)');
  });

  it('clamps values correctly to prevent overflowing bounds', () => {
    const { rerender } = render(<Progress value={150} max={100} />);
    
    // Should clamp down to max
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    // Should clamp up to 0
    rerender(<Progress value={-50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('applies indeterminate state correctly', () => {
    render(<Progress indeterminate />);
    const progress = screen.getByRole('progressbar');

    // WAI-ARIA states that indeterminate progress bars should omit aria-valuenow
    expect(progress).not.toHaveAttribute('aria-valuenow');
    const indicator = progress.firstChild as HTMLElement;
    expect(indicator).toHaveClass('nui-progress-indicator--indeterminate');
  });

  it('applies semantic size and variant classes', () => {
    render(<Progress size="lg" variant="success" />);
    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveClass('nui-progress--lg');
    expect(progress).toHaveClass('nui-progress--success');
  });

  it('uses the provided WAI-ARIA label', () => {
    render(<Progress label="Loading files" value={30} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Loading files'
    );
  });
});