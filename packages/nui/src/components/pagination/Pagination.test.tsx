import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
 it('renders nothing if total <= 1', () => {
 const { container } = render(<Pagination page={1} total={1} onChange={vi.fn()} />);
 expect(container).toBeEmptyDOMElement();
 });

 it('renders correct page numbers for small totals without ellipses', () => {
 render(<Pagination page={1} total={5} onChange={vi.fn()} />);
 
 expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
 expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument();
 // Ellipses render as SVGs inside a list item with aria-hidden="true"
 expect(document.querySelector('li[aria-hidden="true"]')).not.toBeInTheDocument();
 });

 it('renders ellipses for large totals to prevent UI overflow', () => {
 // Current: 50, Total: 100, Siblings: 1
 // Expected: 1 ... 49 50 51 ... 100
 render(<Pagination page={50} total={100} siblings={1} onChange={vi.fn()} />);

 expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
 expect(screen.getByRole('button', { name: 'Go to page 100' })).toBeInTheDocument();
 
 expect(screen.getByRole('button', { name: 'Go to page 49' })).toBeInTheDocument();
 expect(screen.getByRole('button', { name: 'Page 50' })).toBeInTheDocument();
 expect(screen.getByRole('button', { name: 'Go to page 51' })).toBeInTheDocument();

 // Should not see far away pages
 expect(screen.queryByRole('button', { name: 'Go to page 20' })).not.toBeInTheDocument();

 // Should see exactly two ellipses
 const ellipses = document.querySelectorAll('li[aria-hidden="true"]');
 expect(ellipses).toHaveLength(2);
 });

 it('handles Previous and Next button clicks', async () => {
 const user = userEvent.setup();
 const handleChangeSpy = vi.fn();
 render(<Pagination page={5} total={10} onChange={handleChangeSpy} />);

 const prev = screen.getByRole('button', { name: 'Previous Page' });
 const next = screen.getByRole('button', { name: 'Next Page' });

 await user.click(prev);
 expect(handleChangeSpy).toHaveBeenCalledWith(4);

 await user.click(next);
 expect(handleChangeSpy).toHaveBeenCalledWith(6);
 });

 it('disables Previous button on the first page', async () => {
 const user = userEvent.setup();
 const handleChangeSpy = vi.fn();
 render(<Pagination page={1} total={10} onChange={handleChangeSpy} />);

 const prev = screen.getByRole('button', { name: 'Previous Page' });
 expect(prev).toBeDisabled();

 await user.click(prev);
 expect(handleChangeSpy).not.toHaveBeenCalled();
 });

 it('disables Next button on the last page', async () => {
 const user = userEvent.setup();
 const handleChangeSpy = vi.fn();
 render(<Pagination page={10} total={10} onChange={handleChangeSpy} />);

 const next = screen.getByRole('button', { name: 'Next Page' });
 expect(next).toBeDisabled();

 await user.click(next);
 expect(handleChangeSpy).not.toHaveBeenCalled();
 });

 it('calls onChange when a specific page number is clicked', async () => {
 const user = userEvent.setup();
 const handleChangeSpy = vi.fn();
 render(<Pagination page={1} total={10} onChange={handleChangeSpy} />);

 const page2 = screen.getByRole('button', { name: 'Go to page 2' });
 await user.click(page2);

 expect(handleChangeSpy).toHaveBeenCalledWith(2);
 });

 it('marks the current page with aria-current="page"', () => {
 render(<Pagination page={3} total={5} onChange={vi.fn()} />);
 
 // The active page modifies its aria-label to 'Page X'
 const page3 = screen.getByRole('button', { name: 'Page 3' });
 expect(page3).toHaveAttribute('aria-current', 'page');

 const page2 = screen.getByRole('button', { name: 'Go to page 2' });
 expect(page2).not.toHaveAttribute('aria-current');
 });

 it('has no accessibility violations', async () => {
 const { container } = render(<Pagination page={1} total={5} onChange={vi.fn()} />);
 expect(await axe(container)).toHaveNoViolations();
 });
});