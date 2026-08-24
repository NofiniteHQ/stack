import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from './Breadcrumbs'; // Imported as type

const sampleItems: BreadcrumbItem[] = [
 { label: 'Home', href: '/' },
 { label: 'Library', href: '/library' },
 { label: 'Data', href: '/data' },
 { label: 'Current Page' },
];

describe('Breadcrumbs Component', () => {
 describe('Rendering', () => {
 it('renders breadcrumb items', () => {
 render(<Breadcrumbs data={sampleItems} />);

 expect(screen.getByText('Home')).toBeInTheDocument();
 expect(screen.getByText('Library')).toBeInTheDocument();
 expect(screen.getByText('Current Page')).toBeInTheDocument();
 });

 it('does not render when items array is empty', () => {
 const { container } = render(<Breadcrumbs data={[]} />);
 expect(container.querySelector('li')).toBeNull();
 });

 it('renders navigation landmark', () => {
 render(<Breadcrumbs data={sampleItems} />);
 expect(screen.getByRole('navigation')).toBeInTheDocument();
 });
 });

 describe('Accessibility', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<Breadcrumbs data={sampleItems} />);
 expect(await axe(container)).toHaveNoViolations();
 });

 it('marks last item as current page via ARIA', () => {
 render(<Breadcrumbs data={sampleItems} />);

 const current = screen.getByText('Current Page');
 expect(current).toHaveAttribute('aria-current', 'page');
 });
 });

 describe('Interactions', () => {
 it('fires click handler on interactive items', async () => {
 const user = userEvent.setup();
 const handleClick = vi.fn();

 const items: BreadcrumbItem[] = [
 { label: 'Home', onClick: handleClick },
 { label: 'Current Page' },
 ];

 render(<Breadcrumbs data={items} />);

 await user.click(screen.getByText('Home'));
 expect(handleClick).toHaveBeenCalledOnce();
 });
 });

 describe('Truncation & Customization', () => {
 it('collapses breadcrumbs with ellipsis when exceeding maxItems', () => {
 const manyItems: BreadcrumbItem[] = [
 { label: 'Home' },
 { label: 'Level 1' },
 { label: 'Level 2' },
 { label: 'Level 3' },
 { label: 'Level 4' },
 { label: 'Current' },
 ];

 // Since items is 6, and maxItems is 4, it should render: Home > ... > Level 4 > Current
 render(<Breadcrumbs data={manyItems} maxItems={4} />);

 expect(screen.getByText('…')).toBeInTheDocument();
 expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
 expect(screen.getByText('Level 4')).toBeInTheDocument();
 });

 it('supports custom separator', () => {
 render(<Breadcrumbs data={sampleItems} separator="/" />);
 
 const separators = screen.getAllByText('/');
 expect(separators.length).toBeGreaterThan(0);
 expect(separators[0]).toHaveAttribute('aria-hidden', 'true');
 });
 });
});