import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { Resizable } from './Resizable';

describe('Resizable Component', () => {

  beforeEach(() => {
    // Mock viewport dimensions so the Math engine has numbers to work with during percentage calculations
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: 1000, configurable: true });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { value: 8, configurable: true }); // Handle width
  });

  const TestGroup = () => (
    <div style={{ width: '1000px', height: '500px' }}>
      <Resizable direction="horizontal">
        <Resizable.Panel defaultSize={30} minSize={10} data-testid="panel-1">
          Left
        </Resizable.Panel>
        <Resizable.Handle withIcon data-testid="handle-1" />
        <Resizable.Panel defaultSize={70} data-testid="panel-2">
          Right
        </Resizable.Panel>
      </Resizable>
    </div>
  );

  it('initializes panels with correct default flex-grow sizes', () => {
    render(<TestGroup />);
    const panel1 = screen.getByTestId('panel-1');
    const panel2 = screen.getByTestId('panel-2');

    expect(panel1.style.flexGrow).toBe('30');
    expect(panel2.style.flexGrow).toBe('70');
  });

  it('updates aria-valuenow on the handle to reflect WAI-ARIA states', () => {
    render(<TestGroup />);
    const handle = screen.getByTestId('handle-1');
    expect(handle).toHaveAttribute('aria-valuenow', '30'); // Associated with the left panel
  });

  it('handles keyboard resizing with Arrow keys', async () => {
    const user = userEvent.setup();
    render(<TestGroup />);
    
    const handle = screen.getByTestId('handle-1');
    const panel1 = screen.getByTestId('panel-1');

    handle.focus();

    // Default step is 2
    await user.keyboard('{ArrowRight}');
    expect(panel1.style.flexGrow).toBe('32');

    // Shift + Arrow jumps by 10
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(panel1.style.flexGrow).toBe('22');
  });

  it('respects minSize constraints during keyboard resize', async () => {
    const user = userEvent.setup();
    render(
      <Resizable>
        <Resizable.Panel defaultSize={15} minSize={10} data-testid="p1">
          1
        </Resizable.Panel>
        <Resizable.Handle data-testid="h1" />
        <Resizable.Panel defaultSize={85}>2</Resizable.Panel>
      </Resizable>
    );
    
    const handle = screen.getByTestId('h1');
    const panel = screen.getByTestId('p1');

    handle.focus();

    // Try to move left by 10% (15 - 10 = 5, which is less than minSize 10)
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');

    // Should be clamped to 10
    expect(panel.style.flexGrow).toBe('10');
  });

  it('applies dragging attribute and cursor style on pointer down', async () => {
    const user = userEvent.setup();
    render(<TestGroup />);
    const handle = screen.getByTestId('handle-1');

    // pointerDown initiates the drag state
    await user.pointer({ target: handle, keys: '[MouseLeft>]' });

    expect(handle).toHaveAttribute('data-dragging', 'true');
    expect(document.body.style.cursor).toBe('col-resize');
    
    // Release pointer to clean up global event listeners
    await user.pointer({ keys: '[/MouseLeft]' });
  });
});