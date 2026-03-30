import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

const mockSelectOpen = vi.fn();
const mockSelectRename = vi.fn();
const mockSelectDelete = vi.fn();
const mockSelectDisabled = vi.fn();

const items: ContextMenuItem[] = [
  { label: 'Open', onSelect: mockSelectOpen },
  { label: 'Rename', onSelect: mockSelectRename },
  { type: 'separator' },
  { label: 'Delete', danger: true, onSelect: mockSelectDelete },
  { label: 'Disabled', disabled: true, onSelect: mockSelectDisabled },
];

describe('ContextMenu Component', () => {
  describe('Rendering', () => {
    it('renders trigger content', () => {
      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('opens menu on right click', () => {
      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      fireEvent.contextMenu(screen.getByTestId('trigger'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders separator', () => {
      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      fireEvent.contextMenu(screen.getByTestId('trigger'));
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onSelect when clicking enabled item', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      fireEvent.contextMenu(screen.getByTestId('trigger'));

      await user.click(screen.getByText('Open'));
      expect(mockSelectOpen).toHaveBeenCalledTimes(1);
    });

    it('does NOT call onSelect for disabled item', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      fireEvent.contextMenu(screen.getByTestId('trigger'));

      await user.click(screen.getByText('Disabled'));
      expect(mockSelectDisabled).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation (ArrowDown + Enter)', () => {
      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      fireEvent.contextMenu(screen.getByTestId('trigger'));

      const menu = screen.getByRole('menu');

      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'Enter' });

      expect(mockSelectRename).toHaveBeenCalledTimes(1);
    });

    it('closes menu on Escape', () => {
      render(
        <ContextMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </ContextMenu>
      );

      fireEvent.contextMenu(screen.getByTestId('trigger'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});