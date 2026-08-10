import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { Button } from './Button';

describe('Button Component', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<Button>Click Me</Button>);
 expect(await axe(container)).toHaveNoViolations();
 });
 describe('Rendering', () => {
 it('renders children correctly', () => {
 render(<Button>Click Me</Button>);
 expect(screen.getByRole('button')).toHaveTextContent('Click Me');
 });

 it('renders left and right icons', () => {
 render(
 <Button
 iconLeft={<span data-testid="left" />}
 iconRight={<span data-testid="right" />}
 >
 Label
 </Button>
 );

 expect(screen.getByTestId('left')).toBeInTheDocument();
 expect(screen.getByTestId('right')).toBeInTheDocument();
 });

 it('renders loading spinner when isLoading is true', () => {
 render(<Button isLoading>Loading</Button>);
 expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
 });

 it('renders with variant and size props without crashing', () => {
 render(
 <Button variant="primary" size="lg">
 Styled
 </Button>
 );

 const btn = screen.getByRole('button');
 expect(btn).toBeInTheDocument();
 });
 });

 describe('Interactions & State', () => {
 it('fires onClick when clicked', async () => {
 const user = userEvent.setup();
 const handleClick = vi.fn();
 render(<Button onClick={handleClick}>Click</Button>);

 await user.click(screen.getByRole('button'));
 expect(handleClick).toHaveBeenCalledTimes(1);
 });

 it('is disabled when disabled prop is true', () => {
 render(<Button disabled>Disabled</Button>);
 expect(screen.getByRole('button')).toBeDisabled();
 });

 it('is disabled when isLoading is true', () => {
 render(<Button isLoading>Loading</Button>);
 expect(screen.getByRole('button')).toBeDisabled();
 });

 it('prevents onClick from firing when isLoading is true', async () => {
 const user = userEvent.setup();
 const handleClick = vi.fn();
 render(<Button isLoading onClick={handleClick}>Loading</Button>);

 await user.click(screen.getByRole('button'));
 // Button is disabled, so the native DOM prevents the click event
 expect(handleClick).not.toHaveBeenCalled();
 });

 it('forwards ref correctly', () => {
 const ref = createRef<HTMLButtonElement>();
 render(<Button ref={ref}>Ref Test</Button>);

 expect(ref.current).toBeInstanceOf(HTMLButtonElement);
 });
 });
});