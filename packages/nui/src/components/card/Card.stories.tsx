// src/components/card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    // Automatically spy on onClick in the Storybook Actions panel
    onClick: fn(),
  },
  argTypes: {
    clickable: {
      control: 'boolean',
      description: 'Makes the card keyboard and mouse clickable',
    },
    hover: {
      control: 'boolean',
      description: 'Adds hover elevation effect',
    },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <Card.Header>Card Title</Card.Header>
      <Card.Body>
        This is a simple card used to group related content together.
      </Card.Body>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <Card.Header>Account</Card.Header>
      <Card.Body>
        Manage your personal information and account settings.
      </Card.Body>
      <Card.Footer>
        <button style={{ padding: '4px 8px' }}>Cancel</button>
        <button style={{ padding: '4px 8px' }}>Save</button>
      </Card.Footer>
    </Card>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <Card.Header>Billing</Card.Header>
      <Card.Body>Your subscription renews automatically every month.</Card.Body>
      <Card.Divider />
      <Card.Footer>
        <button style={{ padding: '4px 8px' }}>View invoices</button>
      </Card.Footer>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card hover style={{ width: 320 }}>
      <Card.Header>Hover me</Card.Header>
      <Card.Body>This card elevates when hovered.</Card.Body>
    </Card>
  ),
};

export const Clickable: Story = {
  args: {
    clickable: true,
  },
  render: (args) => (
    <Card
      {...args}
      style={{ width: 320 }}
    >
      <Card.Header>Clickable Card</Card.Header>
      <Card.Body>Click or press Enter / Space to activate.</Card.Body>
    </Card>
  ),
};

/**
 * Automated Interaction Test
 * Verifies that the clickable variant responds to user interactions.
 */
export const InteractiveTest: Story = {
  args: {
    clickable: true,
  },
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <Card.Header>Interactive Test</Card.Header>
      <Card.Body>This card will be clicked by the test runner.</Card.Body>
    </Card>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalled();
  },
};