import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { FloatingArrow } from './index';

describe('FloatingArrow (alias directory)', () => {
  it('correctly re-exports FloatingArrow component', () => {
    expect(FloatingArrow).toBeDefined();
    expect(FloatingArrow.displayName).toBe('FloatingArrow');
  });

  it('renders correctly via floating-arrow entrypoint', async () => {
    const { container } = render(
      <FloatingArrow placement="bottom" x={20} className="alias-test" />
    );
    const svg = container.querySelector('svg') as SVGSVGElement;

    expect(svg).toBeInTheDocument();
    expect(svg.style.transform).toBe('rotate(180deg)');
    expect(svg.style.left).toBe('20px');
    expect(svg).toHaveClass('alias-test');
    expect(await axe(container)).toHaveNoViolations();
  });
});
