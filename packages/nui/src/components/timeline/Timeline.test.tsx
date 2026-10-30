import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Timeline, TimelineItem } from './Timeline';

const mockData: TimelineItem[] = [
  {
    id: 'step-1',
    title: 'Order Created',
    description: 'Invoice #1042 generated successfully',
    time: '10:00 AM',
    status: 'success',
  },
  {
    id: 'step-2',
    title: 'Processing Payment',
    description: 'Transaction cleared via Stripe',
    time: '10:05 AM',
    status: 'primary',
  },
  {
    id: 'step-3',
    title: 'Delivered',
    description: 'Package delivered at front door',
    time: '11:00 AM',
    status: 'default',
  },
];

describe('Timeline Component', () => {
  describe('Smart Default Mode (data prop)', () => {
    it('renders list container with WAI-ARIA role and label', () => {
      render(<Timeline data={mockData} />);
      const list = screen.getByRole('list', { name: 'Timeline' });
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass('flex', 'relative', 'font-sans');
    });

    it('renders all data items with title, time, and description', () => {
      render(<Timeline data={mockData} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);

      expect(screen.getByText('Order Created')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM')).toBeInTheDocument();
      expect(
        screen.getByText('Invoice #1042 generated successfully')
      ).toBeInTheDocument();

      expect(screen.getByText('Processing Payment')).toBeInTheDocument();
      expect(screen.getByText('Delivered')).toBeInTheDocument();
    });

    it('renders connecting lines between items with aria-hidden', () => {
      const { container } = render(<Timeline data={mockData} />);
      const lines = container.querySelectorAll('.timeline-line');
      // All items render a line element (the last child is visually hidden via CSS selector)
      expect(lines.length).toBeGreaterThanOrEqual(1);
      lines.forEach((line) => {
        expect(line).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Orientation Variants', () => {
    it('applies vertical orientation styles by default', () => {
      render(<Timeline data={mockData} />);
      const list = screen.getByRole('list');
      expect(list).toHaveClass('flex-col', 'gap-8');

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveClass('flex-row', 'items-start');
    });

    it('applies horizontal orientation styles when specified', () => {
      render(<Timeline data={mockData} orientation="horizontal" />);
      const list = screen.getByRole('list');
      expect(list).toHaveClass('flex-row', 'gap-8', 'overflow-x-auto');

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveClass('flex-col', 'items-start', 'w-64');
    });

    it('positions connecting lines appropriately for vertical and horizontal orientations', () => {
      const { container: vertContainer } = render(
        <Timeline data={mockData} orientation="vertical" />
      );
      const vertLine = vertContainer.querySelector('.timeline-line');
      expect(vertLine).toHaveClass('left-[15px]', 'top-8', 'h-full', 'w-[2px]');

      const { container: horizContainer } = render(
        <Timeline data={mockData} orientation="horizontal" />
      );
      const horizLine = horizContainer.querySelector('.timeline-line');
      expect(horizLine).toHaveClass(
        'top-[15px]',
        'left-8',
        'w-full',
        'h-[2px]'
      );
    });
  });

  describe('Status Variants and Nodes', () => {
    it('applies border and background classes matching each status', () => {
      const statusData: TimelineItem[] = [
        { id: '1', title: 'Default', status: 'default' },
        { id: '2', title: 'Primary', status: 'primary' },
        { id: '3', title: 'Success', status: 'success' },
        { id: '4', title: 'Warning', status: 'warning' },
        { id: '5', title: 'Error', status: 'error' },
      ];

      const { container } = render(<Timeline data={statusData} />);
      const nodes = container.querySelectorAll('.rounded-full.border-2');
      expect(nodes).toHaveLength(5);

      expect(nodes[0]).toHaveClass('border-strong');
      expect(nodes[1]).toHaveClass('border-primary');
      expect(nodes[2]).toHaveClass('border-success');
      expect(nodes[3]).toHaveClass('border-warning');
      expect(nodes[4]).toHaveClass('border-danger');

      // Verify indicator dots
      const dots = container.querySelectorAll('.w-2.h-2.rounded-full');
      expect(dots[0]).toHaveClass('bg-muted');
      expect(dots[1]).toHaveClass('bg-primary');
      expect(dots[2]).toHaveClass('bg-success');
      expect(dots[3]).toHaveClass('bg-warning');
      expect(dots[4]).toHaveClass('bg-danger');
    });

    it('renders custom icon with status-appropriate text color', () => {
      const iconData: TimelineItem[] = [
        {
          id: '1',
          title: 'Custom Icon Step',
          icon: <span data-testid="custom-check-icon">✓</span>,
          status: 'success',
        },
      ];

      render(<Timeline data={iconData} />);
      const iconWrapper = screen.getByTestId('custom-check-icon').parentElement;
      expect(iconWrapper).toHaveClass('text-success');
    });
  });

  describe('Compound Component Architecture & Custom Slots', () => {
    it('renders custom JSX composed via Timeline compound parts', () => {
      render(
        <Timeline>
          <Timeline.Item>
            <Timeline.Node status="primary">
              <span data-testid="custom-node-child">1</span>
            </Timeline.Node>
            <Timeline.Content>
              <h4 data-testid="custom-heading">Milestone Alpha</h4>
              <p data-testid="custom-body">Detailed milestone description</p>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
      );

      expect(screen.getByTestId('custom-node-child')).toHaveTextContent('1');
      expect(screen.getByTestId('custom-heading')).toHaveTextContent(
        'Milestone Alpha'
      );
      expect(screen.getByTestId('custom-body')).toHaveTextContent(
        'Detailed milestone description'
      );
    });

    it('hides line on all items when hideLine is true on root', () => {
      const { container } = render(
        <Timeline hideLine>
          <Timeline.Item>
            <Timeline.Node />
            <Timeline.Content title="Step 1" />
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Node />
            <Timeline.Content title="Step 2" />
          </Timeline.Item>
        </Timeline>
      );

      expect(container.querySelector('.timeline-line')).toBeNull();
    });

    it('hides line on a specific item when hideLine is true on that item', () => {
      const { container } = render(
        <Timeline>
          <Timeline.Item hideLine data-testid="item-without-line">
            <Timeline.Node />
            <Timeline.Content title="Step 1" />
          </Timeline.Item>
          <Timeline.Item data-testid="item-with-line">
            <Timeline.Node />
            <Timeline.Content title="Step 2" />
          </Timeline.Item>
        </Timeline>
      );

      const itemWithoutLine = screen.getByTestId('item-without-line');
      expect(itemWithoutLine.querySelector('.timeline-line')).toBeNull();

      const itemWithLine = screen.getByTestId('item-with-line');
      expect(itemWithLine.querySelector('.timeline-line')).not.toBeNull();
    });
  });

  describe('Ref Forwarding and Display Names', () => {
    it('forwards refs across all compound components', () => {
      const rootRef = createRef<HTMLDivElement>();
      const itemRef = createRef<HTMLDivElement>();
      const nodeRef = createRef<HTMLDivElement>();
      const contentRef = createRef<HTMLDivElement>();

      render(
        <Timeline ref={rootRef}>
          <Timeline.Item ref={itemRef}>
            <Timeline.Node ref={nodeRef} />
            <Timeline.Content ref={contentRef} title="Ref Test" />
          </Timeline.Item>
        </Timeline>
      );

      expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
      expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
      expect(nodeRef.current).toBeInstanceOf(HTMLDivElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has explicit displayNames assigned for debugging and DevTools', () => {
      expect(Timeline.displayName).toBe('Timeline');
      expect(Timeline.Item.displayName).toBe('Timeline.Item');
      expect(Timeline.Node.displayName).toBe('Timeline.Node');
      expect(Timeline.Content.displayName).toBe('Timeline.Content');
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility audit in vertical orientation', async () => {
      const { container } = render(
        <Timeline data={mockData} orientation="vertical" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('passes axe accessibility audit in horizontal orientation', async () => {
      const { container } = render(
        <Timeline data={mockData} orientation="horizontal" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
