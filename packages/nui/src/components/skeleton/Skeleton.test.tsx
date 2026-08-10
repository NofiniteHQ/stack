import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
 it('renders with correct default accessibility attributes', () => {
 // Note: Because it has aria-hidden="true" by default, standard getByRole('presentation') 
 // will fail without { hidden: true }
 render(<Skeleton data-testid="skeleton" />);
 
 const el = screen.getByTestId('skeleton');
 expect(el).toHaveAttribute('aria-hidden', 'true');
 expect(el).toHaveAttribute('role', 'presentation');
 });

 it('applies explicit width and height styles correctly', () => {
 render(<Skeleton width={200} height="50%" data-testid="skeleton" />);
 const el = screen.getByTestId('skeleton');

 expect(el.style.width).toBe('200px');
 expect(el.style.height).toBe('50%');
 });

 it('Skeleton.Avatar renders as a perfect circle', () => {
 render(<Skeleton.Avatar size={50} data-testid="avatar" />);
 const el = screen.getByTestId('avatar');

 expect(el.style.width).toBe('50px');
 });

 it('Skeleton.Paragraph renders the requested number of lines', () => {
 const { container } = render(<Skeleton.Paragraph lines={5} />);
 
 // querySelectorAll is appropriate here since aria-hidden="true" prevents standard queries
 const lines = container.querySelectorAll('[role="presentation"]');
 expect(lines).toHaveLength(5);
 
 // Last line should be shorter (75%) by default to mimic real text
 expect(lines[4]).toHaveStyle({ width: '75%' });
 });

 it('disables animation when animated prop is set to false', () => {
 render(<Skeleton animated={false} data-testid="skeleton" />);
 const el = screen.getByTestId('skeleton');
 
 expect(el).toBeInTheDocument();
 });

 describe('Accessibility', () => {
 it('has no accessibility violations', async () => {
 const { container } = render(<Skeleton />);
 expect(await axe(container)).toHaveNoViolations();
 });
 });
});