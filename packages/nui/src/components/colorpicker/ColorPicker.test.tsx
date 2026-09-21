import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders correctly', () => {
    render(<ColorPicker value="#000000" />);
    const button = screen.getByTitle('Choose Color');
    expect(button).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<ColorPicker disabled value="#ffffff" />);
    const button = screen.getByTitle('Choose Color');
    expect(button).toBeDisabled();
  });

  it('does not render color indicator badge when transparent in icon variant', () => {
    const { container } = render(
      <ColorPicker variant="icon" value="transparent" />
    );
    const badge = container.querySelector('.rounded-full.border-surface');
    expect(badge).toBeNull();
  });

  it('renders color indicator badge when color is set in icon variant', () => {
    const { container } = render(
      <ColorPicker variant="icon" value="#3b82f6" />
    );
    const badge = container.querySelector('.rounded-full.border-surface');
    expect(badge).toBeInTheDocument();
  });
});
