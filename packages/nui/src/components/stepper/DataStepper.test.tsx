import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataStepper } from './DataStepper';

const mockSteps = [
 {
 title: 'Step 1',
 description: 'Description 1',
 content: <div data-testid="content-1">Content for Step 1</div>,
 },
 {
 title: 'Step 2',
 description: 'Description 2',
 content: <div data-testid="content-2">Content for Step 2</div>,
 },
 {
 title: 'Step 3',
 description: 'Description 3',
 content: <div data-testid="content-3">Content for Step 3</div>,
 },
];

describe('DataStepper Component', () => {
 it('renders the stepper with the correct steps', () => {
 render(<DataStepper steps={mockSteps} activeStep={0} />);

 // Titles should be rendered
 expect(screen.getByText('Step 1')).toBeInTheDocument();
 expect(screen.getByText('Step 2')).toBeInTheDocument();
 expect(screen.getByText('Step 3')).toBeInTheDocument();

 // Descriptions should be rendered
 expect(screen.getByText('Description 1')).toBeInTheDocument();
 expect(screen.getByText('Description 2')).toBeInTheDocument();
 expect(screen.getByText('Description 3')).toBeInTheDocument();
 });

 it('renders the content of the currently active step', () => {
 const { rerender } = render(<DataStepper steps={mockSteps} activeStep={0} />);

 // Content for step 1 should be visible
 expect(screen.getByTestId('content-1')).toBeInTheDocument();
 expect(screen.queryByTestId('content-2')).not.toBeInTheDocument();

 // Change to step 2
 rerender(<DataStepper steps={mockSteps} activeStep={1} />);
 expect(screen.queryByTestId('content-1')).not.toBeInTheDocument();
 expect(screen.getByTestId('content-2')).toBeInTheDocument();
 });

 it('supports vertical orientation', () => {
 const { container } = render(<DataStepper steps={mockSteps} activeStep={0} orientation="vertical" />);
 // The wrapper should have flex-row for vertical orientation based on our implementation
 const flexContainer = container.firstChild as HTMLElement;
 expect(flexContainer.className).toContain('flex-row');
 });

 it('passes other props to the underlying Stepper component', () => {
 const onChangeSpy = vi.fn();
 render(<DataStepper steps={mockSteps} activeStep={0} disableFuture onChange={onChangeSpy} />);
 
 // Future steps should be disabled
 const step2Button = screen.getByRole('button', { name: /Step 2: Step 2/i });
 expect(step2Button).toBeDisabled();
 });
});
