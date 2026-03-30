import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NUIProvider, useTheme } from './NUIProvider';

// --- Mocks ---

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false, // Default to light mode for tests
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Helper component to consume context for testing
const TestConsumer = () => {
  // Corrected destructuring to match the interface
  const { theme, resolvedTheme, setTheme } = useTheme(); 
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <span data-testid="resolved-value">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
};

describe('NUIProvider (Theme System)', () => {
  beforeEach(() => {
    // Clear localStorage and DOM attributes before each test
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <NUIProvider>
        <div>App Content</div>
      </NUIProvider>
    );
    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('defaults to "system" -> "light" (mock default)', () => {
    render(
      <NUIProvider>
        <TestConsumer />
      </NUIProvider>
    );

    // Initial state (based on our mock matchMedia { matches: false })
    expect(screen.getByTestId('theme-value')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-value')).toHaveTextContent('light');
    
    // Check if DOM attribute was applied
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('updates theme and DOM when setTheme is called', async () => {
    const user = userEvent.setup();
    render(
      <NUIProvider>
        <TestConsumer />
      </NUIProvider>
    );

    const setDarkBtn = screen.getByText('Set Dark');
    
    // Switch to Dark
    await user.click(setDarkBtn);

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-value')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).toHaveClass('dark'); // Tailwind compatibility
  });

  it('persists theme selection to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <NUIProvider>
        <TestConsumer />
      </NUIProvider>
    );

    await user.click(screen.getByText('Set Dark'));

    // Verify localStorage was updated (corrected key to match default)
    expect(localStorage.getItem('nui-theme')).toBe('dark');
  });

  it('initializes from localStorage if available', () => {
    // 1. Set storage BEFORE rendering
    localStorage.setItem('nui-theme', 'dark');

    render(
      <NUIProvider>
        <TestConsumer />
      </NUIProvider>
    );

    // 2. Provider should read storage on mount
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('handles system preference correctly (Dark Mode System)', () => {
    // Override matchMedia to simulate System Dark Mode
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true, // System is Dark!
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <NUIProvider>
        <TestConsumer />
      </NUIProvider>
    );

    // Theme is 'system', but resolved should be 'dark'
    expect(screen.getByTestId('theme-value')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-value')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});