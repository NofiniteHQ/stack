import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner Component', () => {
 it('renders with correct accessibility roles', () => {
 render(<Spinner label="Loading profile..." />);

 // role="status" is the ARIA standard for live regions that don't need immediate focus
 const container = screen.getByRole('status');
 expect(container).toBeInTheDocument();

 // Ensure screen readers can find the label text fallback
 expect(screen.getByText('Loading profile...')).toBeInTheDocument();
 });

 it('applies the correct size classes', () => {
 render(<Spinner size="xl" data-testid="spinner" />);
 expect(screen.getByTestId('spinner')).toBeInTheDocument();
 });

 it('applies variant classes for styling', () => {
 render(<Spinner variant="inverse" data-testid="spinner" />);
 expect(screen.getByTestId('spinner')).toBeInTheDocument();
 });

 it('includes an SVG for the visual animation', () => {
 const { container } = render(<Spinner />);
 const svg = container.querySelector('svg');
 
 expect(svg).toBeInTheDocument();
 expect(svg).toHaveAttribute('aria-hidden', 'true');
 });

 it('forwards refs and spreads standard HTML attributes', () => {
 const ref = createRef<HTMLDivElement>();
 render(<Spinner ref={ref} id="custom-spinner" data-custom="test" />);
 
 const element = screen.getByRole('status');
 
 expect(ref.current).toBe(element);
 expect(element).toHaveAttribute('id', 'custom-spinner');
 expect(element).toHaveAttribute('data-custom', 'test');
 });

 describe('Accessibility', () => {
 it('has no accessibility violations', async () => {
 const { container } = render(<Spinner label="Loading..." />);
 expect(await axe(container)).toHaveNoViolations();
 });
 });
});