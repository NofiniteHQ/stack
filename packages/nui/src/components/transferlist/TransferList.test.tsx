import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TransferList } from './TransferList';

const mockOptions = [
  { value: '1', label: 'Item 1' },
  { value: '2', label: 'Item 2' },
];

describe('TransferList Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <TransferList options={mockOptions} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders all options in the left list by default', () => {
    render(<TransferList options={mockOptions} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('moves items to the right list', async () => {
    const handleChange = vi.fn();
    render(<TransferList options={mockOptions} onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox', { name: 'Item 1' });
    await userEvent.click(checkbox);
    
    const moveRightBtn = screen.getByRole('button', { name: 'Move selected right' });
    await userEvent.click(moveRightBtn);
    
    expect(handleChange).toHaveBeenCalledWith(['1']);
  });

  it('moves all items', async () => {
    const handleChange = vi.fn();
    render(<TransferList options={mockOptions} onChange={handleChange} />);
    
    const moveAllRightBtn = screen.getByRole('button', { name: 'Move all right' });
    await userEvent.click(moveAllRightBtn);
    
    expect(handleChange).toHaveBeenCalledWith(['1', '2']);
  });
});
