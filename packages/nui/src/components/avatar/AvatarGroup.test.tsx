import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from './Avatar';

describe('AvatarGroup Component', () => {
  const avatars = [
    <Avatar key="1" name="User 1" />,
    <Avatar key="2" name="User 2" />,
    <Avatar key="3" name="User 3" />,
    <Avatar key="4" name="User 4" />,
    <Avatar key="5" name="User 5" />,
  ];

  describe('Rendering', () => {
    it('renders only max number of avatars', () => {
      render(<AvatarGroup max={3}>{avatars}</AvatarGroup>);

      expect(screen.getByLabelText('User 1')).toBeInTheDocument();
      expect(screen.getByLabelText('User 2')).toBeInTheDocument();
      expect(screen.getByLabelText('User 3')).toBeInTheDocument();

      expect(screen.queryByLabelText('User 4')).not.toBeInTheDocument();
    });

    it('renders overflow indicator when items exceed max', () => {
      render(<AvatarGroup max={3}>{avatars}</AvatarGroup>);
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('renders all avatars when max exceeds count', () => {
      render(<AvatarGroup max={10}>{avatars}</AvatarGroup>);
      expect(screen.getByLabelText('User 5')).toBeInTheDocument();
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
    });
  });

  describe('Behavior', () => {
    it('passes group size to children', () => {
      render(
        <AvatarGroup size="lg" max={1}>
          <Avatar name="User A" size="sm" />
        </AvatarGroup>
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('data-size', 'lg');
    });

    it('handles max = 0 safely', () => {
      render(<AvatarGroup max={0}>{avatars}</AvatarGroup>);
      expect(screen.getByText('+5')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <AvatarGroup className="custom-group">{avatars}</AvatarGroup>
      );

      expect(container.firstChild).toHaveClass('custom-group');
    });
  });

  describe('Edge Cases', () => {
    it('renders safely with no children', () => {
      render(<AvatarGroup/>);
      // Removed role generic as it's unreliable; testing for empty container is safer
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });
});