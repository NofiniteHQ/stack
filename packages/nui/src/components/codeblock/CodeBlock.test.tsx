import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock Component', () => {
  it('renders code correctly', () => {
    render(<CodeBlock language="javascript" code="test code">test code</CodeBlock>);
    expect(screen.getByText('test code')).toBeInTheDocument();
  });

  it('triggers language change', async () => {
    const user = userEvent.setup();
    const handleLanguageChange = vi.fn();
    
    render(
      <CodeBlock language="javascript" code="test code" onLanguageChange={handleLanguageChange}>
        test code
      </CodeBlock>
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'python');
    
    expect(handleLanguageChange).toHaveBeenCalledWith('python');
  });
});
