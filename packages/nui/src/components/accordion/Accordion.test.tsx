import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Accordion, AccordionItem } from './Accordion';

const items: AccordionItem[] = [
  { id: 'one', title: 'First', content: 'First Content' },
  { id: 'two', title: 'Second', content: 'Second Content' },
  { id: 'three', title: 'Third', content: 'Third Content' },
];

describe('Accordion Component', () => {
  describe('Rendering', () => {
    it('renders all titles', () => {
      render(<Accordion items={items} />);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('initializes with defaultOpenId', () => {
      render(<Accordion items={items} defaultOpenId="two" />);
      const button = screen.getByRole('button', { name: 'Second' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Single mode (default)', () => {
    it('opens one item at a time', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);

      const first = screen.getByRole('button', { name: 'First' });
      const second = screen.getByRole('button', { name: 'Second' });

      await user.click(first);
      expect(first).toHaveAttribute('aria-expanded', 'true');

      await user.click(second);
      expect(second).toHaveAttribute('aria-expanded', 'true');
      expect(first).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes open item when clicked again', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);
      const first = screen.getByRole('button', { name: 'First' });

      await user.click(first);
      expect(first).toHaveAttribute('aria-expanded', 'true');

      await user.click(first);
      expect(first).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Multiple mode', () => {
    it('allows multiple items open', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} multiple />);

      const first = screen.getByRole('button', { name: 'First' });
      const second = screen.getByRole('button', { name: 'Second' });

      await user.click(first);
      await user.click(second);

      expect(first).toHaveAttribute('aria-expanded', 'true');
      expect(second).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('toggles via native button keyboard support (Enter and Space)', async () => {
      const user = userEvent.setup();
      render(<Accordion items={items} />);
      const first = screen.getByRole('button', { name: 'First' });

      // Simulate user tabbing into the component
      await user.tab();
      expect(first).toHaveFocus();

      // Trigger with Enter
      await user.keyboard('{Enter}');
      expect(first).toHaveAttribute('aria-expanded', 'true');

      // Trigger with Space
      await user.keyboard(' ');
      expect(first).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('ARIA Relationships', () => {
    it('sets correct aria-controls and aria-labelledby', () => {
      render(<Accordion items={items} />);
      const first = screen.getByRole('button', { name: 'First' });

      const panelId = first.getAttribute('aria-controls');
      
      // Type narrowing: Safely check if panelId exists instead of using '!'
      if (!panelId) {
        throw new Error('aria-controls attribute is missing from the button');
      }

      const panel = document.getElementById(panelId);

      expect(panel).toBeInTheDocument();
      expect(panel).toHaveAttribute('role', 'region');
      expect(panel).toHaveAttribute('aria-labelledby', first.id);
    });
  });
});