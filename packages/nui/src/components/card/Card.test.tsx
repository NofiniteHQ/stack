// src/components/card/Card.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <Card.Header>Title</Card.Header>
          <Card.Body>Content</Card.Body>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders sub-components correctly', () => {
      render(
        <Card>
          <Card.Header>Header</Card.Header>
          <Card.Body>Body</Card.Body>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Interactions (Non-Clickable)', () => {
    it('is not clickable by default', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Card onClick={handleClick}>
          <Card.Body>Card</Card.Body>
        </Card>
      );

      await user.click(screen.getByText('Card'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Interactions (Clickable)', () => {
    it('calls onClick when clickable', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Card clickable onClick={handleClick}>
          <Card.Body>Clickable</Card.Body>
        </Card>
      );

      await user.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('has button role and tabIndex when clickable', () => {
      render(
        <Card clickable>
          <Card.Body>Accessible</Card.Body>
        </Card>
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('triggers click on Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Card clickable onClick={handleClick}>
          <Card.Body>Keyboard</Card.Body>
        </Card>
      );

      const card = screen.getByRole('button');
      
      await user.tab();
      expect(card).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Card clickable onClick={handleClick}>
          <Card.Body>Keyboard</Card.Body>
        </Card>
      );

      const card = screen.getByRole('button');
      
      await user.tab();
      expect(card).toHaveFocus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});