import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import { DataTabs } from './DataTabs';

describe('DataTabs', () => {
 const tabsData = [
 { value: 'tab1', label: 'Tab 1', content: 'Content 1' },
 { value: 'tab2', title: 'Tab 2', content: 'Content 2' },
 ];

 it('renders tabs dynamically based on data', () => {
 render(<DataTabs defaultValue="tab1" tabs={tabsData} />);

 expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
 expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();

 expect(screen.getByText('Content 1')).toBeInTheDocument();
 
 fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
 
 expect(screen.getByText('Content 2')).toBeInTheDocument();
 });

 it('passes value and handles onChange', () => {
 const handleChange = vi.fn();
 render(<DataTabs value="tab2" onChange={handleChange} tabs={tabsData} />);
 
 expect(screen.getByText('Content 2')).toBeInTheDocument();

 fireEvent.click(screen.getByRole('tab', { name: 'Tab 1' }));
 expect(handleChange).toHaveBeenCalledWith('tab1');
 });
});
