import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VideoPlayer } from './VideoPlayer';
import React from 'react';

describe('VideoPlayer', () => {
  it('renders nothing when no url is provided', () => {
    const { container } = render(<VideoPlayer url="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the video wrapper when a url is provided', () => {
    const { container } = render(<VideoPlayer url="https://youtube.com/watch?v=123" />);
    // Check if the wrapper div has the expected classes
    expect(container.firstChild).toHaveClass('aspect-video');
    expect(container.firstChild).toHaveClass('bg-black');
  });

  it('applies custom className', () => {
    const { container } = render(<VideoPlayer url="https://youtube.com/watch?v=123" className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
