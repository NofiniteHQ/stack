import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Link } from './Link';

describe('Link Component', () => {
  it('renders a native <a> tag by default with correct text', () => {
    render(<Link href="/home">Go Home</Link>);
    
    const link = screen.getByText('Go Home');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('applies default styling classes', () => {
    render(<Link href="/home">Styled Link</Link>);
    
    const link = screen.getByText('Styled Link');
    expect(link).toHaveClass('nui-link');
    expect(link).toHaveClass('nui-link--default');
    expect(link).toHaveClass('nui-link--underline-hover');
  });

  it('applies custom variant and underline classes', () => {
    render(
      <Link href="/danger" variant="danger" underline="always">
        Delete
      </Link>
    );
    
    const link = screen.getByText('Delete');
    expect(link).toHaveClass('nui-link--danger');
    expect(link).toHaveClass('nui-link--underline-always');
  });

  it('merges custom classNames correctly', () => {
    render(
      <Link href="/test" className="custom-utility-class">
        Test
      </Link>
    );
    
    const link = screen.getByText('Test');
    expect(link).toHaveClass('nui-link');
    expect(link).toHaveClass('custom-utility-class');
  });

  it('applies security attributes automatically when isExternal is true', () => {
    render(
      <Link href="https://example.com" isExternal>
        External Site
      </Link>
    );
    
    const link = screen.getByText('External Site');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('forwards refs correctly to the native anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link ref={ref} href="/ref">Ref Link</Link>);
    
    const link = screen.getByText('Ref Link');
    expect(ref.current).toBe(link);
  });

  describe('Polymorphic Behavior (asChild)', () => {
    it('delegates rendering to the child element when asChild is true', () => {
      render(
        <Link asChild variant="primary">
          {/* Mocking a Next.js or React Router Link */}
          <span data-testid="mock-router-link" className="router-link-class">
            Router Link
          </span>
        </Link>
      );

      const mockLink = screen.getByTestId('mock-router-link');
      
      // The NUI Link should NOT render an <a> tag wrapper
      expect(mockLink.parentElement?.tagName).not.toBe('A');
      
      // The target element should be the <span> we provided
      expect(mockLink.tagName).toBe('SPAN');
      
      // It MUST merge the NUI classes with the child's classes
      expect(mockLink).toHaveClass('nui-link');
      expect(mockLink).toHaveClass('nui-link--primary');
      expect(mockLink).toHaveClass('router-link-class');
    });

    it('merges external attributes onto the polymorphic child', () => {
      render(
        <Link asChild isExternal>
          <a href="https://example.com" data-testid="external-child">
            External Child
          </a>
        </Link>
      );

      const externalChild = screen.getByTestId('external-child');
      expect(externalChild).toHaveAttribute('target', '_blank');
      expect(externalChild).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});