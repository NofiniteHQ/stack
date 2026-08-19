import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { NUIProvider, useTheme } from './NUIProvider';

const meta: Meta<typeof NUIProvider> = {
 title: 'Components/Core/NUIProvider',
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
 const btnClass = "inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md border border-default bg-surface text-default cursor-pointer transition-colors duration-200 hover:bg-subtle focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)] font-sans";

 return (
 <div className="p-10 border border-default rounded-lg bg-surface text-default w-[320px] text-center transition-all duration-300 font-sans shadow-sm">
 <h3 className="mt-0 mb-6 text-lg font-bold text-default">Theme Playground</h3>
 
 <div className="my-5 text-left text-sm bg-subtle p-4 rounded-md border border-default">
 <p className="m-0 mb-2"><strong className="font-semibold text-default">Selected:</strong> <span className="text-muted">{theme}</span></p>
 <p className="m-0"><strong className="font-semibold text-default">Resolved:</strong> <span data-testid="story-resolved" className="text-primary font-medium">{resolvedTheme}</span></p>
 </div>

 <div className="flex gap-2 justify-center mt-6">
 <button onClick={() => setTheme('light')} className={btnClass}>Light ☀️</button>
 <button onClick={() => setTheme('dark')} className={btnClass}>Dark 🌙</button>
 <button onClick={() => setTheme('system')} className={btnClass}>System 💻</button>
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