import React from 'react';
import { Dropdown } from './Dropdown';

export type DataDropdownItemType = {
 label?: React.ReactNode;
 onClick?: (e?: React.MouseEvent) => void;
 type?: 'item' | 'separator';
 disabled?: boolean;
};

export interface DataDropdownProps {
 /** The element that triggers the dropdown to open */
 trigger: React.ReactNode;
 /** Array of items to render in the dropdown menu */
 items: DataDropdownItemType[];
 /** Alignment of the dropdown menu */
 align?: 'start' | 'end';
}

/**
 * DataDropdown Component
 * * A data-driven wrapper around the primitive Dropdown components.
 */
export function DataDropdown({ trigger, items, align = 'start' }: DataDropdownProps) {
 return (
 <Dropdown>
 <Dropdown.Trigger>
 {trigger}
 </Dropdown.Trigger>
 <Dropdown.Menu align={align}>
 {items.map((item, index) => {
 if (item.type === 'separator') {
 return (
 <div 
 key={`separator-${index}`} 
 className="h-px bg-muted my-1" 
 role="separator" 
 />
 );
 }

 return (
 <Dropdown.Item
 key={`item-${index}`}
 onClick={(e) => {
 if (item.disabled) {
 e.preventDefault();
 return;
 }
 item.onClick?.(e);
 }}
 aria-disabled={item.disabled}
 className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
 >
 {item.label}
 </Dropdown.Item>
 );
 })}
 </Dropdown.Menu>
 </Dropdown>
 );
}
