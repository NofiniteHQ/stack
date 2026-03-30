import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  describe('Rendering', () => {
    it('renders image when src is provided', () => {
      render(<Avatar src="https://example.com/pic.jpg" alt="User Pic" />);

      const nativeImg = screen.getByAltText('User Pic');
      expect(nativeImg).toBeInTheDocument();
      expect(nativeImg).toHaveAttribute('src', 'https://example.com/pic.jpg');
    });

    it('renders initials when no src is provided', () => {
      render(<Avatar name="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders fallback icon when no name and no src', () => {
      render(<Avatar fallbackIcon={<span data-testid="icon">ICON</span>} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders default icon when nothing is provided', () => {
      render(<Avatar />);
      const avatar = screen.getByRole('img', { name: 'Avatar' });
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses name as accessible label when alt not provided', () => {
      render(<Avatar name="Jane Doe" />);
      expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
    });

    it('prefers alt text over name for aria-label', () => {
      render(<Avatar name="Jane Doe" alt="Profile Picture" />);
      expect(
        screen.getByRole('img', { name: 'Profile Picture' })
      ).toBeInTheDocument();
    });

    it('renders status indicator with aria-label', () => {
      render(<Avatar name="User" status="online" />);
      expect(screen.getByLabelText('online')).toBeInTheDocument();
    });
  });

  describe('Behavior', () => {
    it('falls back to initials when image fails to load', () => {
      render(<Avatar src="bad-url.jpg" name="Jane Doe" />);
      
      const nativeImg = screen.getByAltText('Jane Doe');
      fireEvent.error(nativeImg);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('does not render image when loading is true', () => {
      render(<Avatar src="https://example.com/pic.jpg" name="Loading User" loading />);
      
      expect(screen.queryByAltText('Loading User')).not.toBeInTheDocument();
    });
  });

  describe('Data Attributes & Props', () => {
    it('applies correct size and shape attributes', () => {
      render(<Avatar size="xl" shape="square" />);
      const avatar = screen.getByRole('img');

      expect(avatar).toHaveAttribute('data-size', 'xl');
      expect(avatar).toHaveAttribute('data-shape', 'square');
    });

    it('accepts custom className', () => {
      render(<Avatar className="custom-class" />);
      const avatar = screen.getByRole('img');

      expect(avatar).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('handles extra whitespace in name', () => {
      render(<Avatar name="   John    Doe   " />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('handles single word names correctly', () => {
      render(<Avatar name="Prince" />);
      expect(screen.getByText('PR')).toBeInTheDocument();
    });
  });
});