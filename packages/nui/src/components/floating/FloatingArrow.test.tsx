import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { FloatingArrow } from './FloatingArrow';

describe('FloatingArrow Component', () => {
  it('renders SVG with default attributes and classes', () => {
    const { container } = render(
      <FloatingArrow placement="top" data-testid="arrow" />
    );
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 14 14');
    expect(svg).toHaveAttribute('width', '14');
    expect(svg).toHaveAttribute('height', '14');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('floating-arrow', 'select-none', 'z-[1]');
  });

  describe('Placement and Rotation Mapping', () => {
    it('applies rotate(0deg) and bottom offset for top placement', () => {
      const { container } = render(<FloatingArrow placement="top" />);
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg.style.transform).toBe('rotate(0deg)');
      expect(svg.style.bottom).toBe('-7px');
      expect(svg.style.position).toBe('absolute');
    });

    it('applies rotate(180deg) and top offset for bottom placement', () => {
      const { container } = render(<FloatingArrow placement="bottom" />);
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg.style.transform).toBe('rotate(180deg)');
      expect(svg.style.top).toBe('-7px');
    });

    it('applies rotate(270deg) and right offset for left placement', () => {
      const { container } = render(<FloatingArrow placement="left" />);
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg.style.transform).toBe('rotate(270deg)');
      expect(svg.style.right).toBe('-7px');
    });

    it('applies rotate(90deg) and left offset for right placement', () => {
      const { container } = render(<FloatingArrow placement="right" />);
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg.style.transform).toBe('rotate(90deg)');
      expect(svg.style.left).toBe('-7px');
    });

    it('parses composite placements like top-start, bottom-end, left-start, right-end', () => {
      const { container: c1 } = render(<FloatingArrow placement="top-start" />);
      expect((c1.querySelector('svg') as SVGSVGElement).style.transform).toBe(
        'rotate(0deg)'
      );

      const { container: c2 } = render(
        <FloatingArrow placement="bottom-end" />
      );
      expect((c2.querySelector('svg') as SVGSVGElement).style.transform).toBe(
        'rotate(180deg)'
      );

      const { container: c3 } = render(
        <FloatingArrow placement="left-start" />
      );
      expect((c3.querySelector('svg') as SVGSVGElement).style.transform).toBe(
        'rotate(270deg)'
      );

      const { container: c4 } = render(<FloatingArrow placement="right-end" />);
      expect((c4.querySelector('svg') as SVGSVGElement).style.transform).toBe(
        'rotate(90deg)'
      );
    });

    it('falls back to rotate(0deg) for unmapped placement', () => {
      const { container } = render(
        <FloatingArrow placement="unknown-position" />
      );
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg.style.transform).toBe('rotate(0deg)');
    });
  });

  describe('Placement Offsets (x and y coordinates)', () => {
    it('sets left coordinate when x is provided for top and bottom placements', () => {
      const { container: topContainer } = render(
        <FloatingArrow placement="top" x={28} />
      );
      const topSvg = topContainer.querySelector('svg') as SVGSVGElement;
      expect(topSvg.style.left).toBe('28px');

      const { container: bottomContainer } = render(
        <FloatingArrow placement="bottom" x={44} />
      );
      const bottomSvg = bottomContainer.querySelector('svg') as SVGSVGElement;
      expect(bottomSvg.style.left).toBe('44px');
    });

    it('sets top coordinate when y is provided for left and right placements', () => {
      const { container: leftContainer } = render(
        <FloatingArrow placement="left" y={16} />
      );
      const leftSvg = leftContainer.querySelector('svg') as SVGSVGElement;
      expect(leftSvg.style.top).toBe('16px');

      const { container: rightContainer } = render(
        <FloatingArrow placement="right" y={32} />
      );
      const rightSvg = rightContainer.querySelector('svg') as SVGSVGElement;
      expect(rightSvg.style.top).toBe('32px');
    });

    it('leaves coordinate undefined when x or y is null or undefined', () => {
      const { container: c1 } = render(
        <FloatingArrow placement="top" x={null} />
      );
      const s1 = c1.querySelector('svg') as SVGSVGElement;
      expect(s1.style.left).toBe('');

      const { container: c2 } = render(
        <FloatingArrow placement="left" y={undefined} />
      );
      const s2 = c2.querySelector('svg') as SVGSVGElement;
      expect(s2.style.top).toBe('');
    });
  });

  describe('Custom Styling, Fill and Stroke', () => {
    it('uses custom fill, stroke, and strokeWidth', () => {
      const { container } = render(
        <FloatingArrow
          placement="top"
          fill="#ff0000"
          stroke="#00ff00"
          strokeWidth={2}
        />
      );
      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(2);

      // Base fill path
      expect(paths[0]).toHaveAttribute('fill', '#ff0000');

      // Contoured stroke path
      expect(paths[1]).toHaveAttribute('stroke', '#00ff00');
      expect(paths[1]).toHaveAttribute('stroke-width', '2');
      expect(paths[1]).toHaveAttribute('fill', 'none');
      expect(paths[1]).toHaveAttribute('stroke-linecap', 'round');
      expect(paths[1]).toHaveAttribute('stroke-linejoin', 'round');
    });

    it('merges custom className and style', () => {
      const { container } = render(
        <FloatingArrow
          placement="top"
          className="custom-arrow-class"
          style={{ opacity: 0.75 }}
        />
      );
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg).toHaveClass('custom-arrow-class');
      expect(svg).toHaveClass('floating-arrow');
      expect(svg.style.opacity).toBe('0.75');
    });
  });

  describe('Ref forwarding and Accessibility', () => {
    it('forwards ref to the underlying SVG element', () => {
      const ref = createRef<SVGSVGElement>();
      render(<FloatingArrow ref={ref} placement="bottom" />);

      expect(ref.current).toBeInstanceOf(SVGSVGElement);
      expect(ref.current?.tagName).toBe('svg');
    });

    it('has pointerEvents disabled and passes axe accessibility audit', async () => {
      const { container } = render(<FloatingArrow placement="top" />);
      const svg = container.querySelector('svg') as SVGSVGElement;

      expect(svg.style.pointerEvents).toBe('none');
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
