import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders input element with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label and links it to input via WAI-ARIA', () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name');
    expect(input).toBeInTheDocument();
  });

  it('shows description when provided', () => {
    render(<Input description="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('error overrides description visibility', () => {
    render(<Input description="Helper" error="Error message" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('applies aria-describedby to description', () => {
    render(<Input description="Helper text" />);
    const input = screen.getByRole('textbox');
    const description = screen.getByText('Helper text');

    expect(input).toHaveAttribute('aria-describedby', description.id);
  });

  it('applies aria-invalid and aria-describedby when error present', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    const errorText = screen.getByText('Error');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', errorText.id);
  });

  it('renders left and right icons', () => {
    render(
      <Input
        leftIcon={<span data-testid="left" />}
        rightIcon={<span data-testid="right" />}
      />
    );

    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('applies size class correctly', () => {
    render(<Input inputSize="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('nui-input--lg');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows required indicator (*)', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts typing via user interactions', async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello world');
    
    expect(input).toHaveValue('hello world');
  });
});