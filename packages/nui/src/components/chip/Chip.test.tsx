import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip Component', () => {
  describe('Rendering & Content', () => {
    it('renders the label correctly', () => {
      render(<Chip>Enterprise Design</Chip>);
      expect(screen.getByText('Enterprise Design')).toBeInTheDocument();
    });

    it('displays icons on both sides when provided', () => {
      render(
        <Chip
          iconLeft={<span data-testid="l" />}
          iconRight={<span data-testid="r" />}
        >
          Icons
        </Chip>
      );
      expect(screen.getByTestId('l')).toBeInTheDocument();
      expect(screen.getByTestId('r')).toBeInTheDocument();
    });
  });

  describe('Interactivity & Accessibility', () => {
    it('is a static element by default (no button role)', () => {
      const { container } = render(<Chip>Static</Chip>);
      // Static chips should be generic or listitem, not a button
      expect(container.querySelector('[role="button"]')).toBeNull();
    });

    it('assigns role="button" and tabIndex when onSelect is present', () => {
      render(<Chip onSelect={vi.fn()}>Interactive</Chip>);
      const chip = screen.getByRole('button');
      expect(chip).toHaveAttribute('tabIndex', '0');
    });

    it('triggers onSelect via mouse click', async () => {
      const user = userEvent.setup();
      const onSelectSpy = vi.fn();
      render(<Chip onSelect={onSelectSpy}>Click</Chip>);
      
      await user.click(screen.getByRole('button'));
      expect(onSelectSpy).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard activation (Enter and Space)', async () => {
      const user = userEvent.setup();
      const onSelectSpy = vi.fn();
      render(<Chip onSelect={onSelectSpy}>Keyboard</Chip>);
      
      const chip = screen.getByRole('button');
      
      await user.tab();
      expect(chip).toHaveFocus();
      
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(onSelectSpy).toHaveBeenCalledTimes(2);
    });

    it('reflects selection state via aria-pressed', () => {
      render(
        <Chip selected onSelect={vi.fn()}>
          Selected
        </Chip>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Removal Logic', () => {
    it('calls onRemove and prevents event bubbling to onSelect', async () => {
      const user = userEvent.setup();
      const onSelectSpy = vi.fn();
      const onRemoveSpy = vi.fn();

      render(
        <Chip removable onRemove={onRemoveSpy} onSelect={onSelectSpy}>
          Removable
        </Chip>
      );

      const removeBtn = screen.getByRole('button', { name: /remove/i });
      await user.click(removeBtn);

      expect(onRemoveSpy).toHaveBeenCalledOnce();
      // Ensure the click didn't bubble up to the main chip body
      expect(onSelectSpy).not.toHaveBeenCalled();
    });
  });
});