import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Stepper } from './Stepper';
import { Button } from '../button/Button'; // Assumes you have your Button component

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const detailedSteps = [
  { label: 'Shipping', description: 'Address details' },
  { label: 'Billing', description: 'Payment methods' },
  { label: 'Review', optional: true, description: 'Order summary' },
  { label: 'Complete', description: 'Confirmation' },
];

export const Default: Story = {
  args: {
    steps: ['Personal Info', 'Account Details', 'Review'],
    active: 0,
  },
};

export const Detailed: Story = {
  args: {
    steps: detailedSteps,
    active: 2,
  },
};

export const DisabledFuture: Story = {
  args: {
    steps: detailedSteps,
    active: 1,
    disableFuture: true,
  },
};

export const SmallContainer: Story = {
  render: () => (
    <div style={{ width: '300px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
      <p style={{ fontSize: '12px', marginBottom: '16px', color: '#666', fontFamily: 'sans-serif' }}>
        Scrollable on small width:
      </p>
      <Stepper steps={detailedSteps} active={1} />
    </div>
  ),
};

export const InteractiveWizard: Story = {
  render: function Wizard() {
    const [active, setActive] = useState(0);

    const handleNext = () => setActive((prev) => Math.min(prev + 1, detailedSteps.length - 1));
    const handlePrev = () => setActive((prev) => Math.max(prev - 1, 0));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>
        <Stepper 
          steps={detailedSteps} 
          active={active} 
          onChange={setActive} 
        />
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          minHeight: '100px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f8fafc'
        }}>
          Current Step: <strong>{detailedSteps[active].label}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outline" onClick={handlePrev} disabled={active === 0}>Previous</Button>
          <Button variant="primary" onClick={handleNext} disabled={active === detailedSteps.length - 1}>Next</Button>
        </div>
      </div>
    );
  }
};

/**
 * Automated Interaction Test
 * Verifies that clicking an available step updates the active index.
 */
export const AutomatedTest: Story = {
  args: {
    steps: detailedSteps,
    active: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Check initial state
    const firstStep = canvas.getByRole('button', { name: /Step 1: Shipping/i });
    await expect(firstStep).toHaveAttribute('aria-current', 'step');

    // Click the third step
    const thirdStep = canvas.getByRole('button', { name: /Step 3: Review/i });
    await userEvent.click(thirdStep);

    // Ensure the onChange callback was fired properly
    // Note: Because args in Storybook are mocked, we check the mock execution.
    // In the InteractiveWizard story above, this would physically change the UI.
    await expect(args.onChange).toHaveBeenCalledWith(2);
  },
};