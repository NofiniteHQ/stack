import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock Component', () => {
  it('renders code correctly', () => {
    render(
      <CodeBlock language="javascript" code="test code">
        test code
      </CodeBlock>
    );
    expect(screen.getByText('test code')).toBeInTheDocument();
  });

  it('triggers language change', async () => {
    const user = userEvent.setup();
    const handleLanguageChange = vi.fn();

    render(
      <CodeBlock
        language="javascript"
        code="test code"
        onLanguageChange={handleLanguageChange}
      >
        test code
      </CodeBlock>
    );

    const trigger = screen.getByRole('button', { name: /JavaScript/i });
    await user.click(trigger);

    const pythonOption = screen.getByRole('option', { name: 'Python' });
    await user.click(pythonOption);

    expect(handleLanguageChange).toHaveBeenCalledWith('python');
  });
});
