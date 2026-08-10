// src/components/checkbox/Checkbox.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
 it('should have no accessibility violations', async () => {
 const { container } = render(<Checkbox label="Test Checkbox" />);
 expect(await axe(container)).toHaveNoViolations();
 });
 describe('Rendering', () => {
 it('renders with label', () => {
 render(<Checkbox label="Remember me" />);
 expect(screen.getByText('Remember me')).toBeInTheDocument();
 });

 it('renders without label safely', () => {
 render(<Checkbox />);
 const input = screen.getByRole('checkbox');
 expect(input).toBeInTheDocument();
 });

 it('is unchecked by default', () => {
 render(<Checkbox label="Test" />);
 const input = screen.getByRole('checkbox') as HTMLInputElement;
 expect(input.checked).toBe(false);
 });

 it('supports defaultChecked (uncontrolled)', () => {
 render(<Checkbox defaultChecked label="Checked" />);
 const input = screen.getByRole('checkbox') as HTMLInputElement;
 expect(input.checked).toBe(true);
 });
 });

 describe('Interactions (Uncontrolled)', () => {
 it('calls onChange with boolean value', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();

 render(<Checkbox label="Test" onChange={onChangeSpy} />);

 const input = screen.getByRole('checkbox');
 await user.click(input);

 expect(onChangeSpy).toHaveBeenCalledWith(true);
 });

 it('clears indeterminate state visually when clicked', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();

 render(<Checkbox indeterminate onChange={onChangeSpy} label="Mixed" />);

 const input = screen.getByRole('checkbox') as HTMLInputElement;
 await user.click(input);

 expect(onChangeSpy).toHaveBeenCalledWith(true);
 });
 });

 describe('Interactions (Controlled)', () => {
 it('does not change internal state when controlled', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();

 render(<Checkbox checked={false} onChange={onChangeSpy} label="Controlled" />);

 const input = screen.getByRole('checkbox') as HTMLInputElement;
 await user.click(input);

 expect(onChangeSpy).toHaveBeenCalledWith(true);
 expect(input.checked).toBe(false);
 });

 it('does not trigger onChange when disabled', async () => {
 const user = userEvent.setup();
 const onChangeSpy = vi.fn();

 render(<Checkbox disabled onChange={onChangeSpy} label="Disabled" />);

 const input = screen.getByRole('checkbox');
 await user.click(input);

 expect(onChangeSpy).not.toHaveBeenCalled();
 });
 });

 describe('Indeterminate State', () => {
 it('sets indeterminate state on the DOM node and ARIA attributes', () => {
 render(<Checkbox indeterminate label="Mixed" />);

 const input = screen.getByRole('checkbox') as HTMLInputElement;
 expect(input.indeterminate).toBe(true);
 expect(input).toHaveAttribute('aria-checked', 'mixed');
 });
 });
});