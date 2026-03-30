import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { NUIProvider, useTheme } from './NUIProvider';

const meta: Meta<typeof NUIProvider> = {
  title: 'Context/NUIProvider',
  component: NUIProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NUIProvider>;

/**
 * A helper component that consumes the theme to show it working.
 * This simulates a real app component.
 */
const DemoApp = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div 
      style={{
        padding: '40px',
        border: '1px solid var(--nui-border-default, #e2e8f0)',
        borderRadius: '8px',
        background: 'var(--nui-bg-surface, #ffffff)', // Relies on CSS vars set by Provider
        color: 'var(--nui-fg-default, #0f172a)',
        width: '320px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        fontFamily: 'sans-serif'
      }}
    >
      <h3 style={{ marginTop: 0 }}>Theme Playground</h3>
      
      <div style={{ margin: '20px 0', textAlign: 'left', fontSize: '0.9rem', backgroundColor: 'var(--nui-bg-subtle, #f8fafc)', padding: '12px', borderRadius: '6px' }}>
        <p style={{ margin: '0 0 8px 0' }}><strong>Selected:</strong> {theme}</p>
        <p style={{ margin: 0 }}><strong>Resolved:</strong> <span data-testid="story-resolved">{resolvedTheme}</span></p>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button onClick={() => setTheme('light')} style={{ padding: '6px 12px', cursor: 'pointer' }}>Light ☀️</button>
        <button onClick={() => setTheme('dark')} style={{ padding: '6px 12px', cursor: 'pointer' }}>Dark 🌙</button>
        <button onClick={() => setTheme('system')} style={{ padding: '6px 12px', cursor: 'pointer' }}>System 💻</button>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <NUIProvider>
      <DemoApp />
    </NUIProvider>
  ),
};

export const ForceDark: Story = {
  render: () => (
    <NUIProvider defaultTheme="dark">
      <DemoApp />
    </NUIProvider>
  ),
};

/**
 * Automated Interaction Test
 * Verifies that the Provider successfully updates the document level attributes and context state.
 */
export const AutomatedThemeTest: Story = {
  render: () => (
    <NUIProvider defaultTheme="light">
      <DemoApp />
    </NUIProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const htmlNode = document.documentElement;

    // Initial state check
    await expect(htmlNode).toHaveAttribute('data-theme', 'light');

    // Click Dark Mode
    const darkBtn = canvas.getByRole('button', { name: 'Dark 🌙' });
    await userEvent.click(darkBtn);

    // Verify context state updated
    const resolvedText = canvas.getByTestId('story-resolved');
    await expect(resolvedText).toHaveTextContent('dark');

    // Verify DOM updated
    await expect(htmlNode).toHaveAttribute('data-theme', 'dark');
    await expect(htmlNode).toHaveClass('dark');
  }
}