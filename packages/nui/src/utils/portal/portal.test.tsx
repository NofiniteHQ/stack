import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Portal } from './portal'; // Adjust import path if needed

describe('Portal Component', () => {
  it('renders children into document.body', () => {
    // Render Portal inside a specific container to verify it breaks out successfully
    const { unmount } = render(
      <div data-testid="parent-container">
        <p>I am inside the parent</p>
        <Portal>
          <div data-testid="portal-content">I am outside</div>
        </Portal>
      </div>
    );

    const parent = screen.getByTestId('parent-container');
    const content = screen.getByTestId('portal-content');

    // 1. Verify content exists in the document
    expect(content).toBeInTheDocument();

    // 2. Verify content is NOT physically inside the parent container
    expect(parent).not.toContainElement(content);

    // 3. Verify content is directly appended to document.body
    expect(content.parentElement).toBe(document.body);

    // 4. Verify cleanup works (React automatically unmounts portal children)
    unmount();
    expect(content).not.toBeInTheDocument();
  });
});