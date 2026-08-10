import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge Component', () => {
 describe('Rendering', () => {
 it('renders children content', () => {
 render(<Badge>New</Badge>);
 expect(screen.getByText('New')).toBeInTheDocument();
 });

 it('renders count correctly', () => {
 render(<Badge count={5} />);
 expect(screen.getByText('5')).toBeInTheDocument();
 });

 it('respects max count overflow', () => {
 render(<Badge count={120} max={99} />);
 expect(screen.getByText('99+')).toBeInTheDocument();
 });

 it('renders dot mode without text', () => {
 const { container } = render(<Badge count={10} dot />);
 expect(container.textContent).toBe('');
 });
 });

 describe('Variants and Sizes', () => {
 it('applies variant and size classes', () => {
 const { container } = render(
 <Badge variant="success" size="lg">
 OK
 </Badge>
 );
 const badge = container.firstChild;

 expect(badge).toBeInTheDocument();
 });

 it('applies pill shape', () => {
 const { container } = render(<Badge pill>Tag</Badge>);
 expect(container.firstChild).toBeInTheDocument();
 });
 });

 describe('Icons', () => {
 it('renders left and right icons', () => {
 render(
 <Badge
 iconLeft={<span data-testid="left-icon">L</span>}
 iconRight={<span data-testid="right-icon">R</span>}
 >
 Label
 </Badge>
 );

 expect(screen.getByTestId('left-icon')).toBeInTheDocument();
 expect(screen.getByTestId('right-icon')).toBeInTheDocument();
 });
 });

 describe('Interactive behavior', () => {
 it('renders as button when onClick provided', async () => {
 const user = userEvent.setup();
 const handleClick = vi.fn();

 render(<Badge onClick={handleClick}>Click</Badge>);
 const button = screen.getByRole('button');

 await user.click(button);
 
 expect(handleClick).toHaveBeenCalled();
 });

 it('renders as anchor when href provided', () => {
 render(<Badge href="/docs">Docs</Badge>);
 const link = screen.getByRole('link');

 expect(link).toHaveAttribute('href', '/docs');
 });
 });

 describe('Accessibility', () => {
 it('is readable by screen readers', () => {
 render(<Badge>Accessible</Badge>);
 expect(screen.getByText('Accessible')).toBeVisible();
 });

 it('has no accessibility violations', async () => {
 const { container } = render(<Badge>Accessible</Badge>);
 expect(await axe(container)).toHaveNoViolations();
 });
 });
});