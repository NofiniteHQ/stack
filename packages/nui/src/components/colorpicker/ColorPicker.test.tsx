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
});
