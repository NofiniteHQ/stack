import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Rating } from './Rating';

describe('Rating Component', () => {
  it('renders the correct number of stars based on max prop', () => {
    render(<Rating max={10} />);
    
    expect(screen.getByRole('slider')).toBeInTheDocument();
    // Validate we rendered 10 wrappers
    expect(screen.getAllByTestId('star-item')).toHaveLength(10);
  });

  it('handles uncontrolled state with defaultValue via WAI-ARIA', () => {
    render(<Rating defaultValue={3} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '3');
  });

  it('updates value when a star is clicked', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Rating onChange={onChangeSpy} />);

    const items = screen.getAllByTestId('star-item');
    // Click the 4th star (0-indexed)
    await user.click(items[3]); 

    expect(onChangeSpy).toHaveBeenCalledWith(4);
  });

  it('handles fractional half-star pointer math', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    
    // Mock getBoundingClientRect so our internal pointer math knows the element width
    const mockRect = { left: 0, width: 100, top: 0, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: vi.fn() };

    render(<Rating allowHalf onChange={onChangeSpy} />);

    const firstStar = screen.getAllByTestId('star-item')[0];
    firstStar.getBoundingClientRect = vi.fn(() => mockRect as DOMRect);

    // Simulate moving the mouse over the left half of the star (x = 10 out of 100)
    await user.pointer({ target: firstStar, coords: { clientX: 10, clientY: 10 } });
    await user.click(firstStar);

    expect(onChangeSpy).toHaveBeenCalledWith(0.5);
  });

  it('prevents interaction when disabled', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Rating disabled onChange={onChangeSpy} />);

    const firstStar = screen.getAllByTestId('star-item')[0];
    await user.click(firstStar);
    
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  it('prevents interaction when readOnly', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn();
    render(<Rating readOnly onChange={onChangeSpy} />);

    const firstStar = screen.getAllByTestId('star-item')[0];
    await user.click(firstStar);
    
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-readonly', 'true');
  });

  it('supports WAI-ARIA slider keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Rating defaultValue={2} />);
    
    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '3');

    await user.keyboard('{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '2');

    // Test boundary bounds
    await user.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '5');

    await user.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });
});