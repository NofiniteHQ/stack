import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BadgeGroup } from './BadgeGroup';
import { Badge } from './Badge';

describe('BadgeGroup Component', () => {
  describe('Rendering', () => {
    it('renders visible badges up to max', () => {
      render(
        <BadgeGroup max={2}>
          <Badge>One</Badge>
          <Badge>Two</Badge>
          <Badge>Three</Badge>
        </BadgeGroup>
      );

      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.queryByText('Three')).not.toBeInTheDocument();
    });

    it('renders overflow counter correctly', () => {
      render(
        <BadgeGroup max={2}>
          <Badge>One</Badge>
          <Badge>Two</Badge>
          <Badge>Three</Badge>
          <Badge>Four</Badge>
        </BadgeGroup>
      );

      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('renders all items when max exceeds count', () => {
      render(
        <BadgeGroup max={10}>
          <Badge>One</Badge>
          <Badge>Two</Badge>
        </BadgeGroup>
      );

      expect(screen.queryByText('+')).not.toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <BadgeGroup className="custom-class">
          <Badge>One</Badge>
        </BadgeGroup>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});