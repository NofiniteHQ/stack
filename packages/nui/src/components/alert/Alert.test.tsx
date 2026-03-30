import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert Component', () => {
  describe('Rendering', () => {
    it('renders title and content strings', () => {
      render(<Alert title="Test Title">Test Description</Alert>);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('supports rich JSX in the title prop', () => {
      render(<Alert title={<strong>Bold Title</strong>}>Description</Alert>);
      expect(screen.getByText('Bold Title')).toBeInTheDocument();
    });

    it('applies custom className correctly', () => {
      render(<Alert className="custom-alert">Custom Class</Alert>);
      const alert = screen.getByText('Custom Class').closest('.nui-alert');
      expect(alert).toHaveClass('custom-alert');
    });
  });

  describe('Variants & ARIA Roles', () => {
    it('defaults to the info variant and status role', () => {
      render(<Alert>Message</Alert>);
      const alert = screen.getByText('Message').closest('.nui-alert');
      
      expect(alert).toHaveAttribute('data-variant', 'info');
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('applies correct attributes for success variant', () => {
      render(<Alert variant="success">Success Message</Alert>);
      const alert = screen.getByText('Success Message').closest('.nui-alert');
      
      expect(alert).toHaveAttribute('data-variant', 'success');
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('escalates ARIA role to alert for warning and error variants', () => {
      render(<Alert variant="warning">Warning Message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('does not render close button by default', () => {
      render(<Alert>Not closable</Alert>);
      const button = screen.queryByRole('button', { name: /close alert/i });
      expect(button).not.toBeInTheDocument();
    });

    it('renders close button when closable=true', () => {
      render(<Alert closable>Closable Alert</Alert>);
      const button = screen.getByRole('button', { name: /close alert/i });
      expect(button).toBeInTheDocument();
    });

    it('fires the onClose callback when the close button is clicked', async () => {
      const user = userEvent.setup();
      const onCloseSpy = vi.fn();

      render(
        <Alert closable onClose={onCloseSpy}>
          Closable Alert
        </Alert>
      );

      const button = screen.getByRole('button', { name: /close alert/i });
      await user.click(button);

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});