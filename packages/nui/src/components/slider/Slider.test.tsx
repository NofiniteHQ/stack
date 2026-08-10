import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Slider } from './Slider';

describe('Slider Component', () => {
 it('renders with correct ARIA attributes', () => {
 render(<Slider min={0} max={100} value={50} />);
 const thumb = screen.getByRole('slider');

 expect(thumb).toHaveAttribute('aria-valuemin', '0');
 expect(thumb).toHaveAttribute('aria-valuemax', '100');
 expect(thumb).toHaveAttribute('aria-valuenow', '50');
 });

 it('clamps values to min and max gracefully on initial render', () => {
 const onChangeSpy = vi.fn();
 render(<Slider min={0} max={100} defaultValue={150} onChange={onChangeSpy} />);

 // The component logic should clamp the initial 150 back down to 100
 expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
 });

 it('respects the step prop during keyboard navigation', async () => {
 const user = userEvent.setup();
 render(<Slider min={0} max={100} step={5} defaultValue={10} />);
 
 const thumb = screen.getByRole('slider');
 thumb.focus();

 await user.keyboard('{ArrowRight}');
 expect(thumb).toHaveAttribute('aria-valuenow', '15');

 await user.keyboard('{ArrowLeft}');
 expect(thumb).toHaveAttribute('aria-valuenow', '10');
 });

 it('handles PageUp and PageDown (10x step multiplier)', async () => {
 const user = userEvent.setup();
 render(<Slider min={0} max={100} step={1} defaultValue={20} />);
 
 const thumb = screen.getByRole('slider');
 thumb.focus();

 await user.keyboard('{PageUp}');
 expect(thumb).toHaveAttribute('aria-valuenow', '30');

 await user.keyboard('{PageDown}');
 expect(thumb).toHaveAttribute('aria-valuenow', '20');
 });

 it('prevents interaction when disabled', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();
 render(<Slider disabled defaultValue={50} onChange={onChangeSpy} />);
 
 const thumb = screen.getByRole('slider');
 thumb.focus();

 await user.keyboard('{ArrowRight}');
 
 expect(thumb).toHaveAttribute('aria-valuenow', '50'); // Value should not change
 expect(onChangeSpy).not.toHaveBeenCalled();
 });

 describe('Accessibility', () => {
 it('should have no violations', async () => {
 const { container } = render(<Slider aria-label="slider" />);
 expect(await axe(container)).toHaveNoViolations();
 }, 10000);
 });
});