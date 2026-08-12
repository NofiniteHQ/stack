import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Attachment } from './Attachment';

describe('Attachment Component', () => {
  it('renders correctly with props', () => {
    render(<Attachment filename="test.pdf" filesize={1024} filetype="application/pdf" src="test.com" />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText(/1 KB/)).toBeInTheDocument();
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const { container } = render(<Attachment filename="test.pdf" filesize={1024} filetype="application/pdf" isLoading={true} />);
    // The download link should not be present when loading
    expect(container.querySelector('a')).not.toBeInTheDocument();
  });
});
