import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './Collapsible';

describe('Collapsible Component', () => {
  describe('Uncontrolled State & Default Rendering', () => {
    it('renders trigger and starts closed by default', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
          <CollapsibleContent>Hidden Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Toggle Details' });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-state', 'closed');
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('renders initially open when defaultOpen is true', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
          <CollapsibleContent>Visible Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Toggle Details' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('data-state', 'open');
      expect(screen.getByText('Visible Content')).toBeInTheDocument();
    });

    it('toggles open and closed on click in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle Section</CollapsibleTrigger>
          <CollapsibleContent>Collapsible Body</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Toggle Section' });

      // First click: open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('data-state', 'open');
      expect(screen.getByText('Collapsible Body')).toBeInTheDocument();

      // Second click: close
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('Controlled State & Callback Contracts', () => {
    it('respects controlled open prop', () => {
      const { rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger>Controlled Section</CollapsibleTrigger>
          <CollapsibleContent>Controlled Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', {
        name: 'Controlled Section',
      });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Controlled Content')).not.toBeInTheDocument();

      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger>Controlled Section</CollapsibleTrigger>
          <CollapsibleContent>Controlled Content</CollapsibleContent>
        </Collapsible>
      );

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Controlled Content')).toBeInTheDocument();
    });

    it('supports legacy isOpen controlled prop', () => {
      render(
        <Collapsible isOpen={true}>
          <CollapsibleTrigger>Legacy Controlled</CollapsibleTrigger>
          <CollapsibleContent>Legacy Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Legacy Controlled' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Legacy Content')).toBeInTheDocument();
    });

    it('fires onOpenChange with the updated boolean state', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Open Change Test</CollapsibleTrigger>
          <CollapsibleContent>Body</CollapsibleContent>
        </Collapsible>
      );

      await user.click(
        screen.getByRole('button', { name: 'Open Change Test' })
      );
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      await user.click(
        screen.getByRole('button', { name: 'Open Change Test' })
      );
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('fires legacy onToggle callback for backward compatibility', async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <Collapsible onToggle={handleToggle}>
          <CollapsibleTrigger>Toggle Test</CollapsibleTrigger>
          <CollapsibleContent>Body</CollapsibleContent>
        </Collapsible>
      );

      await user.click(screen.getByRole('button', { name: 'Toggle Test' }));
      expect(handleToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('Disabled State', () => {
    it('disables trigger and prevents toggling when disabled on Collapsible', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <Collapsible disabled onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Disabled Trigger</CollapsibleTrigger>
          <CollapsibleContent>Should Not Show</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Disabled Trigger' });
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('aria-disabled', 'true');

      await user.click(trigger);
      expect(handleOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
    });

    it('prevents toggling when trigger itself is marked disabled', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger disabled>Explicitly Disabled</CollapsibleTrigger>
          <CollapsibleContent>Should Not Show</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', {
        name: 'Explicitly Disabled',
      });
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(handleOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation Triggers', () => {
    it('triggers toggle when pressing Enter on focused trigger', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <CollapsibleTrigger>Keyboard Test</CollapsibleTrigger>
          <CollapsibleContent>Keyboard Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Keyboard Test' });
      trigger.focus();
      expect(trigger).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Keyboard Content')).toBeInTheDocument();

      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('triggers toggle when pressing Space on focused trigger', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <CollapsibleTrigger>Space Test</CollapsibleTrigger>
          <CollapsibleContent>Space Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole('button', { name: 'Space Test' });
      trigger.focus();

      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Space Content')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding, Display Names & Accessibility', () => {
    it('forwards refs to root and trigger elements', () => {
      const rootRef = createRef<HTMLDivElement>();
      const triggerRef = createRef<HTMLButtonElement>();

      render(
        <Collapsible ref={rootRef}>
          <CollapsibleTrigger ref={triggerRef}>Ref Trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('has explicit displayNames', () => {
      expect(Collapsible.displayName).toBe('Collapsible');
      expect(CollapsibleTrigger.displayName).toBe('CollapsibleTrigger');
      expect(CollapsibleContent.displayName).toBe('CollapsibleContent');
    });

    it('passes axe accessibility audit in open and closed states', async () => {
      const { container, rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger>A11y Test</CollapsibleTrigger>
          <CollapsibleContent>A11y Body</CollapsibleContent>
        </Collapsible>
      );
      expect(await axe(container)).toHaveNoViolations();

      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger>A11y Test</CollapsibleTrigger>
          <CollapsibleContent>A11y Body</CollapsibleContent>
        </Collapsible>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
