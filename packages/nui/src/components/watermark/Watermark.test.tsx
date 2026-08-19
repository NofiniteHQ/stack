/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Watermark } from './Watermark';

describe('Watermark Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Watermark text="TEST">
        <div>Content</div>
      </Watermark>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders children correctly', () => {
    render(
      <Watermark text="TEST">
        <div>Inner Content</div>
      </Watermark>
    );
    expect(screen.getByText('Inner Content')).toBeInTheDocument();
  });

  it('generates an SVG pattern overlay', () => {
    const { container } = render(<Watermark text="TEST" />);
    // The overlay is the last child of the relative wrapper
    const overlay = container.firstChild?.lastChild as HTMLElement;
    
    expect(overlay).toHaveStyle({
      backgroundImage: expect.stringContaining('url("data:image/svg+xml;base64,'),
    });
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
  });
});
