import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders correctly', () => {
    render(<Kbd>Cmd</Kbd>);
    const kbd = screen.getByText('Ctrl');
    expect(kbd).toBeInTheDocument();
    expect(kbd.tagName).toBe('KBD');
  });
});
