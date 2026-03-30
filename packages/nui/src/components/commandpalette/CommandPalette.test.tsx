import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommandPalette, CommandSection } from './CommandPalette';

/* -------------------------------------------------------
   Mock data
------------------------------------------------------- */

const sections: CommandSection[] = [
  {
    title: 'Navigation',
    items: [
      { id: '1', label: 'Dashboard', onSelect: vi.fn() },
      { id: '2', label: 'Settings', onSelect: vi.fn() },
    ],
  },
  {
    title: 'Actions',
    items: [{ id: '3', label: 'Logout', onSelect: vi.fn() }],
  },
];

/* Optional scrollIntoView mock for JSDOM */
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

/* -------------------------------------------------------
   Tests
------------------------------------------------------- */

describe('CommandPalette Component', () => {
  describe('Rendering', () => {
    it('renders when open is true', () => {
      render(<CommandPalette sections={sections} open />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search commands/i)).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<CommandPalette sections={sections} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Filtering Engine', () => {
    it('filters commands based on input', async () => {
      const user = userEvent.setup();
      render(<CommandPalette sections={sections} open />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'dash');

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('shows empty state when no results match', async () => {
      const user = userEvent.setup();
      render(<CommandPalette sections={sections} open />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'xyz');

      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('selects item on click', async () => {
      const user = userEvent.setup();
      render(<CommandPalette sections={sections} open />);

      await user.click(screen.getByText('Settings'));
      expect(sections[0].items[1].onSelect).toHaveBeenCalled();
    });

    it('selects active item with Enter key', () => {
      render(<CommandPalette sections={sections} open />);

      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Enter' });
      
      expect(sections[0].items[0].onSelect).toHaveBeenCalled();
    });
  });

  describe('Closing Mechanics', () => {
    it('calls onOpenChange(false) on Escape', async () => {
      const user = userEvent.setup();
      const onOpenChangeSpy = vi.fn();

      render(
        <CommandPalette sections={sections} open onOpenChange={onOpenChangeSpy} />
      );

      await user.keyboard('{Escape}');
      expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange(false) when clicking outside', async () => {
      const user = userEvent.setup();
      const onOpenChangeSpy = vi.fn();

      render(
        <>
          <div data-testid="outside">outside</div>
          <CommandPalette sections={sections} open onOpenChange={onOpenChangeSpy} />
        </>
      );

      await user.click(screen.getByTestId('outside'));
      expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('Global Shortcuts', () => {
    it('toggles with Ctrl+K on Windows', () => {
      vi.stubGlobal('navigator', { platform: 'Win32' });

      const onOpenChangeSpy = vi.fn();

      render(
        <CommandPalette
          sections={sections}
          open={false}
          onOpenChange={onOpenChangeSpy}
        />
      );

      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      expect(onOpenChangeSpy).toHaveBeenCalled();
    });
  });
});