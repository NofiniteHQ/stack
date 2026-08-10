import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Stepper } from './Stepper';

const steps = [
 'Cart',
 { label: 'Shipping', description: 'Address details' },
 { label: 'Payment', optional: true },
 'Review'
];

describe('Stepper Component', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<Stepper steps={steps} active={0} />);
 expect(await axe(container)).toHaveNoViolations();
 });

 it('renders a navigation region with an ordered list', () => {
 render(<Stepper steps={steps} active={0} />);
 
 expect(screen.getByRole('navigation', { name: 'Progress Steps' })).toBeInTheDocument();
 expect(screen.getByRole('list')).toBeInTheDocument();
 expect(screen.getAllByRole('listitem')).toHaveLength(4);
 });

 it('marks the active step with aria-current="step"', () => {
 render(<Stepper steps={steps} active={1} />);
 
 const shippingButton = screen.getByRole('button', { name: /Step 2: Shipping/i });
 expect(shippingButton).toHaveAttribute('aria-current', 'step');
 });

 it('does not mark previous steps as active', () => {
 render(<Stepper steps={steps} active={2} />);
 
 const cartButton = screen.getByRole('button', { name: /Step 1: Cart/i });
 expect(cartButton).not.toHaveAttribute('aria-current');
 });

 it('fires onChange when an enabled step is clicked', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<Stepper steps={steps} active={0} onChange={onChangeSpy} />);
 
 const paymentButton = screen.getByRole('button', { name: /Step 3: Payment/i });
 await user.click(paymentButton);
 
 expect(onChangeSpy).toHaveBeenCalledWith(2);
 });

 it('disables future steps when disableFuture is true', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<Stepper steps={steps} active={1} disableFuture onChange={onChangeSpy} />);
 
 // Step 1 (Cart) and Step 2 (Shipping) should be enabled
 expect(screen.getByRole('button', { name: /Step 1: Cart/i })).toBeEnabled();
 expect(screen.getByRole('button', { name: /Step 2: Shipping/i })).toBeEnabled();

 // Step 3 (Payment) is in the future, should be disabled
 const paymentButton = screen.getByRole('button', { name: /Step 3: Payment/i });
 expect(paymentButton).toBeDisabled();

 // Clicking it should not fire onChange
 await user.click(paymentButton);
 expect(onChangeSpy).not.toHaveBeenCalled();
 });

 it('renders optional tags and descriptions correctly', () => {
 render(<Stepper steps={steps} active={0} />);
 
 expect(screen.getByText('Address details')).toBeInTheDocument();
 expect(screen.getByText('(Optional)')).toBeInTheDocument();
 });
});