import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LinkPreview } from './LinkPreview';

describe('LinkPreview Component', () => {
  it('renders provided title and description accurately', () => {
    const { container } = render(
      <LinkPreview
        url="https://nofinite.com"
        title="Nofinite Official"
        description="The Next Generation Computing Platform"
      />
    );

    expect(screen.getByText('Nofinite Official')).toBeInTheDocument();
    expect(
      screen.getByText('The Next Generation Computing Platform')
    ).toBeInTheDocument();
    expect(container.querySelector('.link-preview')).toBeInTheDocument();
  });
});
