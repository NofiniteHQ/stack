import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataDropdown, DataDropdownItemType } from './DataDropdown';

describe('DataDropdown', () => {
 it('renders trigger and items correctly', () => {
 const handleClick = vi.fn();
 const disabledClick = vi.fn();
 const items: DataDropdownItemType[] = [
 { label: 'Item 1', onClick: handleClick },
 { type: 'separator' },
 { label: 'Item 2', disabled: true, onClick: disabledClick },
 ];

 render(
 <DataDropdown
 trigger={<button data-testid="trigger">Trigger</button>}
 items={items}
 />
 );

 const trigger = screen.getByTestId('trigger');
 expect(trigger).toBeInTheDocument();

 // Dropdown items shouldn't be visible initially because it's closed
 expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

 // Open dropdown
 fireEvent.click(trigger);

 // Items should now be visible
 const item1 = screen.getByText('Item 1');
 expect(item1).toBeInTheDocument();

 const item2 = screen.getByText('Item 2');
 expect(item2).toBeInTheDocument();

 // Test separator
 const separators = screen.getAllByRole('separator');
 expect(separators.length).toBeGreaterThan(0);

 // Click on active item
 fireEvent.click(item1);
 expect(handleClick).toHaveBeenCalledTimes(1);

 // Open dropdown again because item click closed it
 fireEvent.click(trigger);
 
 // Click on disabled item
 const item2Again = screen.getByText('Item 2');
 fireEvent.click(item2Again);
 expect(disabledClick).not.toHaveBeenCalled();
 });
});
